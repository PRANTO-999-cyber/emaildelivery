const crypto = require("crypto");
const mongoose = require("mongoose");
const Domain = require("../models/Domain");
const DnsCheckService = require("./dnsCheck.service");

class DomainService {
  /**
   * Register a new custom sending domain for a tenant
   * Generates a 2048-bit RSA DKIM keypair automatically upon registration.
   *
   * @param {string} tenantId
   * @param {string} domainName
   * @param {string} [dkimSelector='default']
   * @returns {Promise<Object>} The created domain document along with DNS setup instructions
   */
  static async registerDomain(tenantId, domainName, dkimSelector = "default") {
    try {
      const cleanDomain = domainName.trim().toLowerCase();

      // 1. Check if domain is already registered under this tenant
      const existingDomain = await Domain.findOne({
        tenantId: new mongoose.Types.ObjectId(tenantId),
        name: cleanDomain,
      });

      if (existingDomain) {
        throw new Error(
          `Domain "${cleanDomain}" is already added to your workspace.`,
        );
      }

      // 2. Generate 2048-bit RSA DKIM Keypair for cryptographic signing
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      // Format public key into clean TXT record value
      const cleanPublicKey = publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\r?\n|\r/g, "");

      const dkimTxtRecord = `v=DKIM1; k=rsa; p=${cleanPublicKey}`;

      // 3. Create domain in database
      const domainDoc = await Domain.create({
        tenantId: new mongoose.Types.ObjectId(tenantId),
        name: cleanDomain,
        dkimSelector,
        dkimPrivateKey: privateKey,
        dkimPublicKey: cleanPublicKey,
        isVerified: false,
        isPrimary: false,
        dnsStatus: {
          spf: false,
          dkim: false,
          dmarc: false,
          mx: false,
          bimi: false,
        },
      });

      // 4. Return DNS Instructions for user to paste into Cloudflare/GoDaddy/Route53
      return {
        domain: domainDoc.name,
        domainId: domainDoc._id,
        dkimSelector: domainDoc.dkimSelector,
        requiredRecords: [
          {
            type: "TXT",
            host: cleanDomain,
            value: `v=spf1 include:_spf.${process.env.APP_SENDING_DOMAIN || "precisioninbox.com"} ~all`,
            purpose: "SPF Authentication",
          },
          {
            type: "TXT",
            host: `${dkimSelector}._domainkey.${cleanDomain}`,
            value: dkimTxtRecord,
            purpose: "DKIM Cryptographic Signing",
          },
          {
            type: "TXT",
            host: `_dmarc.${cleanDomain}`,
            value: `v=DMARC1; p=none; rua=mailto:dmarc-reports@${cleanDomain}`,
            purpose: "DMARC Inbox Protection Policy",
          },
        ],
      };
    } catch (error) {
      console.error("DomainService.registerDomain Error:", error);
      throw error;
    }
  }

  /**
   * Run real-time DNS lookup and update verification state for a domain
   *
   * @param {string} tenantId
   * @param {string} domainId
   * @returns {Promise<Object>} Verification results and updated domain document
   */
  static async verifyDomainDNS(tenantId, domainId) {
    try {
      const domain = await Domain.findOne({
        _id: new mongoose.Types.ObjectId(domainId),
        tenantId: new mongoose.Types.ObjectId(tenantId),
      });

      if (!domain) {
        throw new Error("Domain not found or access denied.");
      }

      // Delegate DNS lookup to DnsCheckService
      const dnsResults = await DnsCheckService.checkAll(
        domain.name,
        domain.dkimSelector,
      );

      const isSpfValid = dnsResults.records.spf.status === "VALID";
      const isDkimValid = dnsResults.records.dkim.status === "VALID";
      const isDmarcValid = dnsResults.records.dmarc.status === "VALID";
      const isMxValid = dnsResults.records.mx.status === "VALID";
      const isBimiValid = dnsResults.records.bimi.status === "VALID";

      const fullyVerified = isSpfValid && isDkimValid && isDmarcValid;

      // Update DB record
      domain.dnsStatus = {
        spf: isSpfValid,
        dkim: isDkimValid,
        dmarc: isDmarcValid,
        mx: isMxValid,
        bimi: isBimiValid,
      };
      domain.isVerified = fullyVerified;
      domain.lastVerifiedAt = new Date();

      await domain.save();

      return {
        domain: domain.name,
        isVerified: domain.isVerified,
        dnsStatus: domain.dnsStatus,
        details: dnsResults.records,
      };
    } catch (error) {
      console.error("DomainService.verifyDomainDNS Error:", error);
      throw error;
    }
  }

  /**
   * Set a domain as the primary sending domain for a tenant workspace
   *
   * @param {string} tenantId
   * @param {string} domainId
   */
  static async setPrimaryDomain(tenantId, domainId) {
    try {
      const tenantObjId = new mongoose.Types.ObjectId(tenantId);
      const domainObjId = new mongoose.Types.ObjectId(domainId);

      const domain = await Domain.findOne({
        _id: domainObjId,
        tenantId: tenantObjId,
      });
      if (!domain) {
        throw new Error("Domain not found.");
      }

      if (!domain.isVerified) {
        throw new Error(
          "Cannot set an unverified domain as primary. Complete DNS setup first.",
        );
      }

      // Remove primary flag from all tenant domains
      await Domain.updateMany(
        { tenantId: tenantObjId },
        { $set: { isPrimary: false } },
      );

      // Set target domain as primary
      domain.isPrimary = true;
      await domain.save();

      return domain;
    } catch (error) {
      console.error("DomainService.setPrimaryDomain Error:", error);
      throw error;
    }
  }

  /**
   * Get all registered domains for a tenant
   *
   * @param {string} tenantId
   */
  static async getTenantDomains(tenantId) {
    try {
      return await Domain.find({
        tenantId: new mongoose.Types.ObjectId(tenantId),
      })
        .select("-dkimPrivateKey") // Never expose private key in API responses
        .sort({ isPrimary: -1, createdAt: -1 });
    } catch (error) {
      console.error("DomainService.getTenantDomains Error:", error);
      throw error;
    }
  }

  /**
   * Delete a sending domain
   *
   * @param {string} tenantId
   * @param {string} domainId
   */
  static async removeDomain(tenantId, domainId) {
    try {
      const domain = await Domain.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(domainId),
        tenantId: new mongoose.Types.ObjectId(tenantId),
      });

      if (!domain) {
        throw new Error("Domain not found or already deleted.");
      }

      return {
        success: true,
        message: `Domain ${domain.name} removed successfully.`,
      };
    } catch (error) {
      console.error("DomainService.removeDomain Error:", error);
      throw error;
    }
  }
}

module.exports = DomainService;
