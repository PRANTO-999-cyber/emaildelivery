import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";
import Domain from "../models/Domain.model.js";
import ContactList from "../models/ContactList.model.js";
import Template from "../models/Template.model.js";
import Campaign from "../models/Campaign.model.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/email_deliverability_platform";

async function seedDatabase() {
  try {
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("✓ Connected successfully.");

    // 1. Clear Existing Test Data
    console.log("🧹 Clearing existing collections...");
    await Promise.all([
      Tenant.deleteMany({}),
      User.deleteMany({}),
      Domain.deleteMany({}),
      ContactList.deleteMany({}),
      Template.deleteMany({}),
      Campaign.deleteMany({}),
    ]);

    // 2. Seed Tenants (Workspaces)
    console.log("🏢 Seeding demo multi-tenant workspaces...");
    const tenants = await Tenant.create([
      {
        name: "Acme Growth Corp",
        slug: "acme-growth",
        plan: "Enterprise",
        featureFlags: {
          enableDedicatedIp: true,
          enableAITestGeneration: true,
          enableCustomSmtp: true,
          enableWarmupAutomation: true,
        },
      },
      {
        name: "Stark Email Labs",
        slug: "stark-labs",
        plan: "Pro",
        featureFlags: {
          enableDedicatedIp: false,
          enableAITestGeneration: true,
          enableCustomSmtp: true,
          enableWarmupAutomation: true,
        },
      },
    ]);

    const [acmeTenant, starkTenant] = tenants;

    // 3. Seed Users with Encrypted Passwords
    console.log("👤 Seeding RBAC users...");
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash("Password123!", salt);

    const users = await User.create([
      {
        fullName: "Alex Mercer",
        email: "alex@acmegrowth.com",
        password: defaultPasswordHash,
        role: "Owner",
        tenantId: acmeTenant._id,
      },
      {
        fullName: "Sarah Connor",
        email: "sarah@acmegrowth.com",
        password: defaultPasswordHash,
        role: "Campaign Manager",
        tenantId: acmeTenant._id,
      },
      {
        fullName: "Tony Stark",
        email: "tony@starklabs.io",
        password: defaultPasswordHash,
        role: "Owner",
        tenantId: starkTenant._id,
      },
    ]);

    // 4. Seed Domain Authentication Records
    console.log("🌐 Seeding domain authentication profiles...");
    const domains = await Domain.create([
      {
        tenantId: acmeTenant._id,
        domainName: "outreach.acmegrowth.com",
        status: "VERIFIED",
        dnsRecords: {
          spf: { status: "VALID", record: "v=spf1 include:mailgun.org ~all" },
          dkim: {
            status: "VALID",
            selector: "s1",
            record:
              "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...",
          },
          dmarc: {
            status: "VALID",
            record: "v=DMARC1; p=reject; rua=mailto:dmarc@acmegrowth.com",
          },
        },
        warmupConfig: {
          enabled: true,
          dailyLimit: 2500,
          currentRampDay: 5,
          totalSentToday: 480,
        },
      },
      {
        tenantId: starkTenant._id,
        domainName: "dispatch.starklabs.io",
        status: "PENDING_VERIFICATION",
        dnsRecords: {
          spf: { status: "VALID", record: "v=spf1 include:sendgrid.net ~all" },
          dkim: { status: "INVALID", selector: "s1", record: null },
          dmarc: { status: "MISSING", record: null },
        },
        warmupConfig: {
          enabled: false,
          dailyLimit: 100,
          currentRampDay: 1,
          totalSentToday: 0,
        },
      },
    ]);

    // 5. Seed Subscriber Contact Lists
    console.log("📋 Seeding contact subscriber lists...");
    const contactLists = await ContactList.create([
      {
        tenantId: acmeTenant._id,
        name: "Q3 Enterprise Prospects",
        description: "B2B Tech VP Decision Makers",
        totalContacts: 1250,
        validCount: 1220,
        suppressedCount: 30,
      },
      {
        tenantId: acmeTenant._id,
        name: "Product Newsletter Subscribers",
        description: "Opt-in website subscribers",
        totalContacts: 8500,
        validCount: 8410,
        suppressedCount: 90,
      },
    ]);

    // 6. Seed Email Templates
    console.log("✉️ Seeding email templates...");
    const templates = await Template.create([
      {
        tenantId: acmeTenant._id,
        name: "Enterprise Cold Outreach v1",
        subject: "Scaling email infrastructure for {{companyName}}",
        bodyHtml:
          "<p>Hi {{firstName}},</p><p>Notice you are leading growth at {{companyName}}. Our platform guarantees 99% inbox placement.</p><p>Best,<br>Alex</p>",
        bodyText:
          "Hi {{firstName}},\n\nNotice you are leading growth at {{companyName}}. Our platform guarantees 99% inbox placement.\n\nBest,\nAlex",
      },
    ]);

    // 7. Seed Sample Campaigns & Telemetry
    console.log("🚀 Seeding sample campaigns & deliverability telemetry...");
    await Campaign.create([
      {
        tenantId: acmeTenant._id,
        name: "Q3 Product Announcement",
        domainId: domains[0]._id,
        templateId: templates[0]._id,
        contactListId: contactLists[0]._id,
        subject: "Introducing automated deliverability circuit breakers",
        status: "completed",
        metrics: {
          sent: 1220,
          delivered: 1205,
          opened: 482,
          clicked: 134,
          bounced: 15,
          complaints: 1,
          deliveredRate: 98.7,
          openRate: 40.0,
          bounceRate: 1.2,
        },
      },
      {
        tenantId: acmeTenant._id,
        name: "Re-engagement Blitz",
        domainId: domains[0]._id,
        templateId: templates[0]._id,
        contactListId: contactLists[1]._id,
        subject: "Are you still looking to optimize your deliverability?",
        status: "paused_circuit_breaker",
        metrics: {
          sent: 200,
          delivered: 188,
          opened: 40,
          clicked: 5,
          bounced: 12, // 6% hard bounce rate (Trips circuit breaker > 5%)
          complaints: 2,
          deliveredRate: 94.0,
          openRate: 21.2,
          bounceRate: 6.0,
        },
      },
    ]);

    console.log("✅ Database seeding complete!");
    console.log("----------------------------------------------------");
    console.log(`Demo Owner Login:   alex@acmegrowth.com / Password123!`);
    console.log(`Demo Manager Login: sarah@acmegrowth.com / Password123!`);
    console.log("----------------------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed with error:", err);
    process.exit(1);
  }
}

seedDatabase();
