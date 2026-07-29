const mongoose = require("mongoose");
const EmailLog = require("../models/EmailLog");
const Bounce = require("../models/Bounce");
const Tracking = require("../models/Tracking");
const Campaign = require("../models/Campaign");

class AnalyticsService {
  /**
   * Get comprehensive deliverability and campaign performance statistics
   * @param {string} tenantId
   * @param {string|null} [campaignId=null]
   * @returns {Promise<Object>} Aggregated metrics and deliverability health status
   */
  static async getOverviewStats(tenantId, campaignId = null) {
    try {
      const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
      const matchQuery = { tenantId: tenantObjectId };

      if (campaignId) {
        matchQuery.campaignId = new mongoose.Types.ObjectId(campaignId);
      }

      // 1. Email Delivery Aggregation (EmailLogs)
      const logStats = await EmailLog.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const counts = {
        totalSent: 0,
        delivered: 0,
        failed: 0,
        bounced: 0,
      };

      logStats.forEach((stat) => {
        if (stat._id === "sent" || stat._id === "delivered")
          counts.delivered += stat.count;
        if (stat._id === "failed") counts.failed += stat.count;
        if (stat._id === "bounced") counts.bounced += stat.count;
        counts.totalSent += stat.count;
      });

      // 2. Bounce Detailed Breakdown (Hard vs Soft)
      const bounceStats = await Bounce.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$bounceType", // 'hard' or 'soft'
            count: { $sum: 1 },
          },
        },
      ]);

      let hardBounces = 0;
      let softBounces = 0;
      bounceStats.forEach((item) => {
        if (item._id === "hard") hardBounces = item.count;
        if (item._id === "soft") softBounces = item.count;
      });

      // 3. User Engagement Events (Opens, Clicks, Unsubscribes, Complaints)
      const trackingStats = await Tracking.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$eventType", // 'open', 'click', 'unsubscribe', 'spam_complaint'
            uniqueRecipients: { $addToSet: "$recipient" },
            totalEvents: { $sum: 1 },
          },
        },
      ]);

      let uniqueOpens = 0;
      let totalOpens = 0;
      let uniqueClicks = 0;
      let totalClicks = 0;
      let unsubscribes = 0;
      let spamComplaints = 0;

      trackingStats.forEach((item) => {
        if (item._id === "open") {
          uniqueOpens = item.uniqueRecipients.length;
          totalOpens = item.totalEvents;
        } else if (item._id === "click") {
          uniqueClicks = item.uniqueRecipients.length;
          totalClicks = item.totalEvents;
        } else if (item._id === "unsubscribe") {
          unsubscribes = item.uniqueRecipients.length;
        } else if (item._id === "spam_complaint") {
          spamComplaints = item.uniqueRecipients.length;
        }
      });

      // 4. Rate Calculations (Safe from division-by-zero)
      const deliveredCount = counts.delivered || 1;
      const sentCount = counts.totalSent || 1;

      const openRate = ((uniqueOpens / deliveredCount) * 100).toFixed(2);
      const clickThroughRate = ((uniqueClicks / deliveredCount) * 100).toFixed(
        2,
      );
      const bounceRate = ((counts.bounced / sentCount) * 100).toFixed(2);
      const unsubscribeRate = ((unsubscribes / deliveredCount) * 100).toFixed(
        2,
      );
      const spamComplaintRate = (
        (spamComplaints / deliveredCount) *
        100
      ).toFixed(2);

      // 5. Sender Reputation & Health Indicator
      // Gmail and Yahoo punish accounts exceeding 0.3% spam complaint rate or 3% hard bounce rate
      let healthStatus = "EXCELLENT";
      let healthMessage =
        "Your sender reputation is strong. Delivery to Inbox is optimal.";

      if (
        parseFloat(spamComplaintRate) >= 0.3 ||
        parseFloat(bounceRate) >= 5.0
      ) {
        healthStatus = "CRITICAL";
        healthMessage =
          "High risk of inbox delivery failure! Spam complaints or bounce rates exceed critical limits.";
      } else if (
        parseFloat(spamComplaintRate) >= 0.1 ||
        parseFloat(bounceRate) >= 2.0
      ) {
        healthStatus = "WARNING";
        healthMessage =
          "Slight elevation in bounces or spam complaints. Monitor your list quality.";
      }

      return {
        summary: {
          totalSent: counts.totalSent,
          delivered: counts.delivered,
          failed: counts.failed,
          bounced: counts.bounced,
          hardBounces,
          softBounces,
          uniqueOpens,
          totalOpens,
          uniqueClicks,
          totalClicks,
          unsubscribes,
          spamComplaints,
        },
        rates: {
          openRate: parseFloat(openRate),
          clickThroughRate: parseFloat(clickThroughRate),
          bounceRate: parseFloat(bounceRate),
          unsubscribeRate: parseFloat(unsubscribeRate),
          spamComplaintRate: parseFloat(spamComplaintRate),
        },
        health: {
          status: healthStatus,
          message: healthMessage,
        },
      };
    } catch (error) {
      console.error("AnalyticsService.getOverviewStats Error:", error);
      throw new Error(
        `Failed to calculate overview analytics: ${error.message}`,
      );
    }
  }

  /**
   * Get historical sending trends over a custom timeframe (for charts)
   * @param {string} tenantId
   * @param {number} [days=7]
   * @returns {Promise<Array>} Time-series data formatted for chart rendering
   */
  static async getSendingTimeline(tenantId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const timeline = await EmailLog.aggregate([
        {
          $match: {
            tenantId: new mongoose.Types.ObjectId(tenantId),
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      return timeline;
    } catch (error) {
      console.error("AnalyticsService.getSendingTimeline Error:", error);
      throw new Error(`Failed to retrieve sending timeline: ${error.message}`);
    }
  }

  /**
   * Records real-time email engagement events (Pixels, Clicks, Webhooks)
   * @param {Object} eventData
   * @param {string} eventData.tenantId
   * @param {string} eventData.campaignId
   * @param {string} eventData.recipient
   * @param {string} eventData.eventType - 'open' | 'click' | 'unsubscribe' | 'spam_complaint'
   * @param {string} [eventData.userAgent]
   * @param {string} [eventData.ipAddress]
   * @param {string} [eventData.linkUrl]
   */
  static async recordTrackingEvent({
    tenantId,
    campaignId,
    recipient,
    eventType,
    userAgent = null,
    ipAddress = null,
    linkUrl = null,
  }) {
    try {
      // 1. Log event entry
      const trackingDoc = await Tracking.create({
        tenantId,
        campaignId,
        recipient,
        eventType,
        userAgent,
        ipAddress,
        linkUrl,
        timestamp: new Date(),
      });

      // 2. Increment counters in Campaign document for quick dashboard reads
      if (campaignId) {
        const fieldMap = {
          open: "stats.openCount",
          click: "stats.clickCount",
          unsubscribe: "stats.unsubscribeCount",
          spam_complaint: "stats.complaintCount",
        };

        const updateField = fieldMap[eventType];
        if (updateField) {
          await Campaign.findByIdAndUpdate(campaignId, {
            $inc: { [updateField]: 1 },
          });
        }
      }

      return trackingDoc;
    } catch (error) {
      console.error("AnalyticsService.recordTrackingEvent Error:", error);
      throw new Error(`Failed to record tracking event: ${error.message}`);
    }
  }
}

module.exports = AnalyticsService;
