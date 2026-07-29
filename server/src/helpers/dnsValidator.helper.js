import dns from "dns/promises";

/**
 * Helper utilities for DNS authentication record verification.
 */
export const dnsValidator = {
  /**
   * Validate SPF record existence and format for a domain.
   * @param {string} domainName
   */
  async verifySPF(domainName) {
    try {
      const records = await dns.resolveTxt(domainName);
      const flatRecords = records.flat();
      const spfRecord = flatRecords.find((r) => r.startsWith("v=spf1"));

      return {
        valid: Boolean(spfRecord),
        record: spfRecord || null,
        message: spfRecord
          ? "Valid SPF record detected"
          : "Missing v=spf1 TXT record",
      };
    } catch (err) {
      return {
        valid: false,
        record: null,
        message: `DNS lookup failed: ${err.message}`,
      };
    }
  },

  /**
   * Validate DKIM TXT record at selector endpoint.
   * @param {string} domainName
   * @param {string} selector - Default selector e.g. 's1' or 'k1'
   */
  async verifyDKIM(domainName, selector = "s1") {
    const dkimDomain = `${selector}._domainkey.${domainName}`;
    try {
      const records = await dns.resolveTxt(dkimDomain);
      const flatRecords = records.flat();
      const dkimRecord = flatRecords.find(
        (r) => r.includes("v=DKIM1") || r.includes("p="),
      );

      return {
        valid: Boolean(dkimRecord),
        record: dkimRecord || null,
        message: dkimRecord
          ? "Valid DKIM selector record found"
          : "DKIM key missing at selector",
      };
    } catch (err) {
      return {
        valid: false,
        record: null,
        message: `DKIM lookup error: ${err.message}`,
      };
    }
  },

  /**
   * Validate DMARC policy TXT record at _dmarc.domain.
   * @param {string} domainName
   */
  async verifyDMARC(domainName) {
    const dmarcDomain = `_dmarc.${domainName}`;
    try {
      const records = await dns.resolveTxt(dmarcDomain);
      const flatRecords = records.flat();
      const dmarcRecord = flatRecords.find((r) => r.startsWith("v=DMARC1"));

      return {
        valid: Boolean(dmarcRecord),
        record: dmarcRecord || null,
        message: dmarcRecord
          ? "Valid DMARC record found"
          : "Missing _dmarc TXT record",
      };
    } catch (err) {
      return {
        valid: false,
        record: null,
        message: `DMARC lookup failed: ${err.message}`,
      };
    }
  },
};
