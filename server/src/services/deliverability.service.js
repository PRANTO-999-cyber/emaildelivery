const dns = require("dns").promises;
const mongoose = require("mongoose");
const Domain = require("../models/Domain");
const EmailLog = require("../models/EmailLog");
const Tracking = require("../models/Tracking");

class DeliverabilityService {
  /**
   * Verify DNS Records (SPF, DKIM, DMARC, BIMI) for a sending domain
   * @param {string} domainName
   * @param {string} [dkimSelector='default']
   * @returns {Promise<Object>} Detailed DNS verification status
   */
  static async verifyDomainRecords(domainName, dkimSelector = "default") {
    const results = {
      domain: domainName,
      spf: { valid: false, record: null, error: null },
      dkim: { valid: false, record: null, error: null },
      dmarc: { valid: false, record: null, policy: "none", error: null },
      bimi: { valid: false, record: null, error: null },
      isReadyForInbox: false,
    };

    try {
      // 1. Check SPF Record (TXT at root)
      try {
        const txtRecords = await dns.resolveTxt(domainName);
        const spfRecord = txtRecords.flat().find((r) => r.startsWith("v=spf1"));
        if (spfRecord) {
          results.spf.record = spfRecord;
          // Verify SPF includes standard directives
          results.spf.valid = spfRecord.includes("all");
        } else {
          results.spf.error = "No SPF record found.";
        }
      } catch (err) {
        results.spf.error = `SPF Lookup failed: ${err.message}`;
      }

      // 2. Check DKIM Record
      const dkimDomain = `${dkimSelector}._domainkey.${domainName}`;
      try {
        const dkimTxt = await dns.resolveTxt(dkimDomain);
        const dkimRecord = dkimTxt.flat().join("");
        if (dkimRecord.includes("v=DKIM1")) {
          results.dkim.valid = true;
          results.dkim.record = dkimRecord;
        } else {
          results.dkim.error = "Invalid DKIM public key format.";
        }
      } catch (err) {
        results.dkim.error = `DKIM record missing at ${dkimDomain}`;
      }

      // 3. Check DMARC Record
      const dmarcDomain = `_dmarc.${domainName}`;
      try {
        const dmarcTxt = await dns.resolveTxt(dmarcDomain);
        const dmarcRecord = dmarcTxt
          .flat()
          .find((r) => r.startsWith("v=DMARC1"));
        if (dmarcRecord) {
          results.dmarc.record = dmarcRecord;
          results.dmarc.valid = true;

          // Parse DMARC policy (p=none | p=quarantine | p=reject)
          const policyMatch = dmarcRecord.match(/p=(none|quarantine|reject)/);
          if (policyMatch) {
            results.dmarc.policy = policyMatch[1];
          }
        } else {
          results.dmarc.error = "No DMARC record found.";
        }
      } catch (err) {
        results.dmarc.error = `DMARC record missing at ${dmarcDomain}`;
      }

      // 4. Check BIMI Record (Optional, but gives brand logo in Gmail)
      const bimiDomain = `default._bimi.${domainName}`;
      try {
        const bimiTxt = await dns.resolveTxt(bimiDomain);
        const bimiRecord = bimiTxt.flat().find((r) => r.startsWith("v=BIMI1"));
        if (bimiRecord) {
          results.bimi.valid = true;
          results.bimi.record = bimiRecord;
        }
      } catch (err) {
        results.bimi.error = "BIMI not configured.";
      }

      // 5. Overall Inbox Readiness Condition
      // Requires SPF, DKIM, and DMARC to be fully valid
      results.isReadyForInbox =
        results.spf.valid && results.dkim.valid && results.dmarc.valid;

      // Update Domain model status in database if domain is registered
      await Domain.findOneAndUpdate(
        { name: domainName },
        {
          $set: {
            "dnsStatus.spf": results.spf.valid,
            "dnsStatus.dkim": results.dkim.valid,
            "dnsStatus.dmarc": results.dmarc.valid,
            "dnsStatus.bimi": results.bimi.valid,
            isVerified: results.isReadyForInbox,
            lastVerifiedAt: new Date(),
          },
        },
      );

      return results;
    } catch (error) {
      console.error(
        `DeliverabilityService.verifyDomainRecords Error [${domainName}]:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Calculate a real-time Sender Health Score (0 to 100) based on recent metrics
   * @param {string} tenantId
   * @param {string} domainName
   * @returns {Promise<Object>} Calculated score and risk factors
   */
  static async calculateHealthScore(tenantId, domainName) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const tenantObjId = new mongoose.Types.ObjectId(tenantId);

      // Aggregate last 30 days email status
      const logStats = await EmailLog.aggregate([
        {
          $match: {
            tenantId: tenantObjId,
            fromDomain: domainName,
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      let totalSent = 0;
      let bounced = 0;

      logStats.forEach((s) => {
        totalSent += s.count;
        if (s._id === "bounced") bounced += s.count;
      });

      // Get spam complaints
      const spamComplaints = await Tracking.countDocuments({
        tenantId: tenantObjId,
        eventType: "spam_complaint",
        createdAt: { $gte: thirtyDaysAgo },
      });

      if (totalSent === 0) {
        return {
          score: 100,
          status: "UNKNOWN",
          reason: "Insufficient sending data for scoring.",
        };
      }

      const bounceRate = (bounced / totalSent) * 100;
      const complaintRate = (spamComplaints / totalSent) * 100;

      // Deduct points based on deliverability violations
      let score = 100;

      // Penalty for Bounce Rate (>2% hurts, >5% critical)
      if (bounceRate > 5.0) score -= 40;
      else if (bounceRate > 2.0) score -= 20;

      // Heavy penalty for Spam Complaints (Gmail threshold is strict 0.3%)
      if (complaintRate >= 0.3) score -= 50;
      else if (complaintRate >= 0.1) score -= 25;

      score = Math.max(0, score);

      let status = "HEALTHY";
      if (score < 50) status = "POOR";
      else if (score < 80) status = "NEEDS_ATTENTION";

      return {
        score,
        status,
        metrics: {
          totalSent,
          bounceRate: parseFloat(bounceRate.toFixed(2)),
          complaintRate: parseFloat(complaintRate.toFixed(2)),
        },
      };
    } catch (error) {
      console.error("DeliverabilityService.calculateHealthScore Error:", error);
      throw error;
    }
  }

  /**
   * Pre-flight Spam Check for Email Body Content
   * Detects spam trigger words and formatting issues that cause land in Spam folder
   * @param {Object} emailData
   * @param {string} emailData.subject
   * @param {string} emailData.htmlContent
   */
  static analyzeEmailContent({ subject = "", htmlContent = "" }) {
    const triggerWords = [
      "100% free",
      "earn money",
      "buy now",
      "guaranteed",
      "no risk",
      "cash bonus",
      "winner",
      "click here",
      "urgent",
      "make $",
      "risk free",
    ];

    const warnings = [];
    let spamScore = 0;

    const lowerSubject = subject.toLowerCase();
    const lowerBody = htmlContent.toLowerCase();

    // 1. Check Subject Capitalization
    if (subject === subject.toUpperCase() && subject.length > 5) {
      spamScore += 15;
      warnings.push(
        "Subject line is in ALL CAPS. Spam filters heavily penalize this.",
      );
    }

    // 2. Check Subject Excessive Punctuation
    if (/!!+|\?\?+/.test(subject)) {
      spamScore += 10;
      warnings.push(
        "Subject line contains multiple consecutive exclamation/question marks.",
      );
    }

    // 3. Trigger Word Match
    const foundTriggers = triggerWords.filter(
      (word) => lowerSubject.includes(word) || lowerBody.includes(word),
    );
    if (foundTriggers.length > 0) {
      spamScore += foundTriggers.length * 10;
      warnings.push(
        `Contains spam-trigger phrases: ${foundTriggers.join(", ")}`,
      );
    }

    // 4. HTML to Text Ratio check
    const textOnly = htmlContent.replace(/<[^>]*>/g, "").trim();
    if (htmlContent.length > 0 && textOnly.length / htmlContent.length < 0.2) {
      spamScore += 20;
      warnings.push(
        "Low text-to-HTML ratio. Email contains heavy code or image-only content with minimal text.",
      );
    }

    return {
      passed: spamScore < 30,
      spamScore, // Lower is better
      riskLevel: spamScore > 50 ? "HIGH" : spamScore > 20 ? "MEDIUM" : "LOW",
      warnings,
    };
  }
}

module.exports = DeliverabilityService;
