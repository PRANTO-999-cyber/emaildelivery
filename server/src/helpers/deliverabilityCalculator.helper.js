/**
 * Calculates domain deliverability health scores and circuit breaker conditions.
 */
export const deliverabilityCalculator = {
  /**
   * Computes composite health score (0 - 100).
   */
  calculateHealthScore({ bounceRate = 0, complaintRate = 0, openRate = 0 }) {
    let score = 100;

    // Deduct points heavily for hard bounces
    if (bounceRate > 2.0) score -= (bounceRate - 2.0) * 10;

    // Deduct heavily for spam complaints (Target < 0.08%)
    if (complaintRate > 0.08) score -= (complaintRate - 0.08) * 300;

    // Small bonus for strong engagement
    if (openRate > 25.0) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  },

  /**
   * Evaluates whether campaign circuit breaker should trigger.
   * Standard safety limit: 5.0% hard bounce rate on minimum 50 dispatched emails.
   */
  shouldTriggerCircuitBreaker({
    totalSent,
    totalBounced,
    thresholdPercent = 5.0,
  }) {
    if (totalSent < 50) return false; // Minimum sample size required
    const currentBounceRate = (totalBounced / totalSent) * 100;
    return currentBounceRate >= thresholdPercent;
  },
};
