import dns from "dns/promises";

// ===============================
// DNS Lookup
// ===============================

export const resolveA = async (domain) => {
  try {
    return await dns.resolve4(domain);
  } catch {
    return [];
  }
};

export const resolveMX = async (domain) => {
  try {
    return await dns.resolveMx(domain);
  } catch {
    return [];
  }
};

export const resolveTXT = async (domain) => {
  try {
    const records = await dns.resolveTxt(domain);
    return records.map((r) => r.join(""));
  } catch {
    return [];
  }
};

export const checkSPF = async (domain) => {
  const txt = await resolveTXT(domain);

  const record = txt.find((r) => r.startsWith("v=spf1"));

  return {
    valid: !!record,
    record: record || null,
  };
};

export const checkDKIM = async (selector, domain) => {
  try {
    const txt = await resolveTXT(`${selector}._domainkey.${domain}`);

    const record = txt.find((r) => r.includes("v=DKIM1"));

    return {
      valid: !!record,
      record: record || null,
    };
  } catch {
    return {
      valid: false,
      record: null,
    };
  }
};

export const checkDMARC = async (domain) => {
  try {
    const txt = await resolveTXT(`_dmarc.${domain}`);

    const record = txt.find((r) => r.startsWith("v=DMARC1"));

    return {
      valid: !!record,
      record: record || null,
    };
  } catch {
    return {
      valid: false,
      record: null,
    };
  }
};

// ===========================================
// Full Deliverability Check
// ===========================================

export const runFullDeliverabilityCheck = async (
  domain,
  selector = "default",
) => {
  const [a, mx, spf, dkim, dmarc] = await Promise.all([
    resolveA(domain),
    resolveMX(domain),
    checkSPF(domain),
    checkDKIM(selector, domain),
    checkDMARC(domain),
  ]);

  const score =
    (a.length ? 20 : 0) +
    (mx.length ? 20 : 0) +
    (spf.valid ? 20 : 0) +
    (dkim.valid ? 20 : 0) +
    (dmarc.valid ? 20 : 0);

  return {
    domain,
    score,
    passed: score >= 80,

    a,

    mx,

    spf,

    dkim,

    dmarc,

    checkedAt: new Date(),
  };
};

export default {
  resolveA,
  resolveMX,
  resolveTXT,
  checkSPF,
  checkDKIM,
  checkDMARC,
  runFullDeliverabilityCheck,
};
