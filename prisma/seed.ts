import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

// ============================================
// STATIC DATA
// ============================================

const CONTACTS = [
  { name: "Ahmad Fauzi", email: "ahmad.fauzi@gmail.com", phone: "+62812345678", company: "PT Maju Bersama", position: "CEO" },
  { name: "Dewi Lestari", email: "dewi.lestari@yahoo.com", phone: "+62823456789", company: "CV Sukses Mandiri", position: "Marketing Director" },
  { name: "Rizky Pratama", email: "rizky.pratama@outlook.com", phone: "+62834567890", company: "PT Teknologi Nusantara", position: "CTO" },
  { name: "Putri Anggraini", email: "putri.anggraini@gmail.com", phone: "+62845678901", company: "PT Digital Solusi", position: "Product Manager" },
  { name: "Fajar Nugroho", email: "fajar.nugroho@gmail.com", phone: "+62856789012", company: "CV Berkah Jaya", position: "Operations Manager" },
  { name: "Siti Nurhaliza", email: "siti.nurhaliza@yahoo.com", phone: "+62867890123", company: "PT Harmoni Abadi", position: "Finance Director" },
  { name: "Bambang Setiadi", email: "bambang.setiadi@gmail.com", phone: "+62878901234", company: "PT Nusa Global", position: "VP of Sales" },
  { name: "Rina Marlina", email: "rina.marlina@outlook.com", phone: "+62889012345", company: "CV Cemerlang", position: "HR Manager" },
  { name: "Hendra Wijaya", email: "hendra.wijaya@gmail.com", phone: "+62890123456", company: "PT Satu Nusa", position: "Director" },
  { name: "Maya Sari", email: "maya.sari@yahoo.com", phone: "+62801234567", company: "PT Asri Jaya", position: "Business Development" },
  { name: "Tono Sugiarto", email: "tono.sugiarto@gmail.com", phone: "+62811223344", company: "PT Makmur Sejahtera", position: "COO" },
  { name: "Ani Kusumaningrum", email: "ani.kusuma@gmail.com", phone: "+62822334455", company: "CV Pelangi", position: "Marketing Manager" },
];

const LEAD_SOURCES = ["Website", "Referral", "Cold Call", "Social Media", "Event", "LinkedIn", "Google Ads"];
const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;
const DEAL_STAGES = ["DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] as const;
const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const ACTIVITY_TYPES = ["CALL", "EMAIL", "MEETING", "NOTE", "TASK"] as const;
const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "CANCELLED"] as const;
const PAYMENT_METHODS = ["CASH", "BANK_TRANSFER", "CARD", "OTHER"] as const;

// ============================================
// SEED
// ============================================

async function main() {
  console.log("Starting seed...\n");

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("No users found in database. Create users first via Clerk.");
    process.exit(1);
  }
  console.log(`Found ${users.length} existing user(s).\n`);

  const [admin, ...regularUsers] = users;
  const teamMembers = [admin, ...regularUsers];

  // ── TEAM ──────────────────────────────────────────
  console.log("Creating teams...");
  const teamNames = ["Sales Team", "Marketing Team", "Operations Team"];
  const teams = [];
  for (let i = 0; i < Math.min(teamNames.length, users.length); i++) {
    const team = await prisma.team.create({
      data: {
        name: teamNames[i],
        ownerId: users[i].id,
      },
    });
    teams.push(team);
    console.log(`  Created team: ${team.name}`);
  }

  // ── TEAM MEMBERS ──────────────────────────────────
  console.log("Adding team members...");
  const teamMemberRecords = [];
  for (const team of teams) {
    const members = users.slice(0, randomInt(2, users.length));
    for (const user of members) {
      const member = await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: user.id === team.ownerId ? "ADMIN" : randomItem(["USER", "MANAGER"]),
        },
      });
      teamMemberRecords.push(member);
    }
  }
  console.log(`  Created ${teamMemberRecords.length} team member(s)`);

  // ── SUBSCRIPTIONS ─────────────────────────────────
  console.log("Creating subscriptions...");
  const subscriptions = [];
  for (const team of teams) {
    const sub = await prisma.subscription.create({
      data: {
        teamId: team.id,
        stripeId: `sub_${crypto.randomUUID().slice(0, 12)}`,
        plan: randomItem(["FREE", "PRO", "ENTERPRISE"]),
        status: "ACTIVE",
        startDate: daysAgo(randomInt(30, 365)),
        autoRenew: true,
      },
    });
    subscriptions.push(sub);
  }
  console.log(`  Created ${subscriptions.length} subscription(s)`);

  // ── PIPELINES ─────────────────────────────────────
  console.log("Creating pipelines...");
  const pipelines = [];
  for (const team of teams) {
    const pipeline = await prisma.pipeline.create({
      data: {
        name: `${team.name} Pipeline`,
        teamId: team.id,
        stages: ["DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "LOST"],
      },
    });
    pipelines.push(pipeline);
  }
  console.log(`  Created ${pipelines.length} pipeline(s)`);

  // ── CONTACTS ──────────────────────────────────────
  console.log("Creating contacts...");
  const contacts = [];
  for (const c of CONTACTS) {
    const creator = randomItem(users);
    const contact = await prisma.contact.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        position: c.position,
        enrichedData: {
          linkedin: `https://linkedin.com/in/${c.name.toLowerCase().replace(/\s/g, "-")}`,
          source: randomItem(LEAD_SOURCES),
        },
        createdBy: creator.id,
      },
    });
    contacts.push(contact);
  }
  console.log(`  Created ${contacts.length} contact(s)`);

  // ── LEADS ─────────────────────────────────────────
  console.log("Creating leads...");
  const leads = [];
  for (const contact of contacts) {
    const assignee = Math.random() > 0.3 ? randomItem(users) : null;
    const lead = await prisma.lead.create({
      data: {
        contactId: contact.id,
        status: randomItem(LEAD_STATUSES),
        score: randomFloat(0, 100),
        source: randomItem(LEAD_SOURCES),
        assignedTo: assignee?.id,
        notes: randomItem([
          "Interested in enterprise plan",
          "Follow up next week",
          "Budget approved, ready to close",
          "Needs demo first",
          "Referred by existing client",
          null,
        ]),
      },
    });
    leads.push(lead);
  }
  console.log(`  Created ${leads.length} lead(s)`);

  // ── DEALS ─────────────────────────────────────────
  console.log("Creating deals...");
  const deals = [];
  const dealTitles = [
    "Enterprise License - PT Maju Bersama",
    "Pro Plan - CV Sukses Mandiri",
    "Custom Integration - PT Teknologi Nusantara",
    "Annual Subscription - PT Digital Solusi",
    "Team License - CV Berkah Jaya",
    "Premium Support - PT Harmoni Abadi",
    "Bulk Deal - PT Nusa Global",
    "Startup Package - CV Cemerlang",
  ];
  for (let i = 0; i < dealTitles.length; i++) {
    const pipeline = randomItem(pipelines);
    const stage = randomItem(DEAL_STAGES);
    const lead = leads[i] || null;
    const assignee = randomItem(users);
    const deal = await prisma.deal.create({
      data: {
        title: dealTitles[i],
        leadId: lead?.id,
        pipelineId: pipeline.id,
        stage,
        value: randomFloat(500, 50000),
        currency: "IDR",
        probability: stage === "WON" ? 100 : stage === "LOST" ? 0 : randomFloat(10, 90),
        expectedCloseDate: daysFromNow(randomInt(-30, 90)),
        assignedTo: assignee.id,
        createdBy: assignee.id,
      },
    });
    deals.push(deal);
  }
  console.log(`  Created ${deals.length} deal(s)`);

  // ── ACTIVITIES ────────────────────────────────────
  console.log("Creating activities...");
  const activities = [];
  const activityDescriptions: Record<(typeof ACTIVITY_TYPES)[number], string[]> = {
    CALL: [
      "Initial discovery call with client",
      "Follow-up call to discuss pricing",
      "Check-in call after onboarding",
      "Demo call scheduled",
    ],
    EMAIL: [
      "Sent proposal via email",
      "Follow-up email after meeting",
      "Welcome email to new client",
      "Sent contract for review",
    ],
    MEETING: [
      "Product demo meeting",
      "QBR with client stakeholders",
      "Internal strategy meeting",
      "Onboarding kickoff meeting",
    ],
    NOTE: [
      "Client prefers WhatsApp communication",
      "Budget cycle starts in Q3",
      "Decision maker is the CTO",
      "Competitor is using Salesforce",
    ],
    TASK: [
      "Prepare custom proposal",
      "Send pricing sheet",
      "Schedule technical review",
      "Update CRM records",
    ],
  };
  for (const lead of leads.slice(0, 8)) {
    const type = randomItem(ACTIVITY_TYPES);
    const activity = await prisma.activity.create({
      data: {
        leadId: lead.id,
        type,
        description: randomItem(activityDescriptions[type]),
        performedBy: randomItem(users).id,
        scheduledAt: Math.random() > 0.5 ? daysFromNow(randomInt(1, 14)) : null,
        completedAt: Math.random() > 0.6 ? daysAgo(randomInt(0, 7)) : null,
      },
    });
    activities.push(activity);
  }
  for (const deal of deals.slice(0, 5)) {
    const type = randomItem(ACTIVITY_TYPES);
    const activity = await prisma.activity.create({
      data: {
        dealId: deal.id,
        type,
        description: randomItem(activityDescriptions[type]),
        performedBy: randomItem(users).id,
        scheduledAt: Math.random() > 0.5 ? daysFromNow(randomInt(1, 14)) : null,
        completedAt: Math.random() > 0.6 ? daysAgo(randomInt(0, 7)) : null,
      },
    });
    activities.push(activity);
  }
  console.log(`  Created ${activities.length} activity(ies)`);

  // ── TASKS ─────────────────────────────────────────
  console.log("Creating tasks...");
  const tasks = [];
  const taskTitles = [
    "Follow up with Ahmad Fauzi",
    "Prepare Q4 proposal",
    "Send contract to PT Teknologi Nusantara",
    "Schedule demo for CV Sukses Mandiri",
    "Update deal stage for Enterprise License",
    "Review onboarding checklist",
    "Call back Rizky Pratama",
    "Send invoice for Pro Plan",
    "Prepare marketing materials",
    "Internal team sync",
  ];
  for (let i = 0; i < taskTitles.length; i++) {
    const isDealTask = i < deals.length;
    const task = await prisma.task.create({
      data: {
        title: taskTitles[i],
        description: `Detailed notes for: ${taskTitles[i]}`,
        status: randomItem(TASK_STATUSES),
        priority: randomItem(TASK_PRIORITIES),
        dueDate: daysFromNow(randomInt(-5, 14)),
        completedAt: Math.random() > 0.7 ? daysAgo(randomInt(0, 5)) : null,
        leadId: !isDealTask && leads[i] ? leads[i].id : null,
        dealId: isDealTask && deals[i] ? deals[i].id : null,
        assignedTo: randomItem(users).id,
        createdBy: randomItem(users).id,
      },
    });
    tasks.push(task);
  }
  console.log(`  Created ${tasks.length} task(s)`);

  // ── INVOICES ──────────────────────────────────────
  console.log("Creating invoices...");
  const invoices = [];
  for (let i = 0; i < 5; i++) {
    const deal = deals[i];
    const contact = contacts[i];
    const subtotal = randomFloat(1000, 20000);
    const tax = Number((subtotal * 0.11).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const invoice = await prisma.invoice.create({
      data: {
        dealId: deal?.id,
        contactId: contact.id,
        status: randomItem(INVOICE_STATUSES),
        subtotal,
        tax,
        total,
        dueDate: daysFromNow(randomInt(7, 60)),
        createdBy: randomItem(users).id,
      },
    });
    invoices.push(invoice);
  }
  console.log(`  Created ${invoices.length} invoice(s)`);

  // ── INVOICE ITEMS ─────────────────────────────────
  console.log("Creating invoice items...");
  let invoiceItemCount = 0;
  const itemDescriptions = [
    "Software License (Annual)",
    "Implementation Services",
    "Training & Onboarding",
    "Premium Support Package",
    "Custom Development",
    "Data Migration",
    "Consulting Hours",
  ];
  for (const invoice of invoices) {
    const itemCount = randomInt(1, 3);
    for (let j = 0; j < itemCount; j++) {
      const qty = randomInt(1, 5);
      const unitPrice = randomFloat(500, 5000);
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          description: randomItem(itemDescriptions),
          quantity: qty,
          unitPrice,
          amount: Number((qty * unitPrice).toFixed(2)),
        },
      });
      invoiceItemCount++;
    }
  }
  console.log(`  Created ${invoiceItemCount} invoice item(s)`);

  // ── PAYMENTS ──────────────────────────────────────
  console.log("Creating payments...");
  let paymentCount = 0;
  for (const invoice of invoices) {
    if (invoice.status === "PAID" || Math.random() > 0.5) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.total,
          method: randomItem(PAYMENT_METHODS),
          reference: `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          paidAt: daysAgo(randomInt(0, 10)),
        },
      });
      paymentCount++;
    }
  }
  console.log(`  Created ${paymentCount} payment(s)`);

  // ── AI SESSIONS & MESSAGES ────────────────────────
  console.log("Creating AI sessions...");
  let aiMessageCount = 0;
  for (const user of users.slice(0, 3)) {
    const session = await prisma.aISession.create({
      data: {
        userId: user.id,
        context: { topic: randomItem(["lead_analysis", "deal_strategy", "contact_research"]) },
      },
    });
    const msgCount = randomInt(2, 4);
    for (let m = 0; m < msgCount; m++) {
      await prisma.aIMessage.create({
        data: {
          sessionId: session.id,
          role: m % 2 === 0 ? "user" : "assistant",
          content: m % 2 === 0
            ? randomItem([
                "Analisis performa lead bulan ini",
                "Buat strategi closing untuk deal yang stuck",
                "Rekomendasi follow-up untuk kontak baru",
              ])
            : randomItem([
                "Berdasarkan data, konversi lead dari LinkedIn lebih tinggi 35%. Fokuskan effort di channel ini.",
                "Deal yang stuck di PROPOSAL lebih dari 7 hari perlu follow-up agresif. Sarankan meeting langsung.",
                "3 kontak baru belum dihubungi dalam 3 hari. Prioritaskan yang dari referral.",
              ]),
          metadata: m % 2 !== 0 ? { confidence: randomFloat(0.7, 0.99) } : null,
        },
      });
      aiMessageCount++;
    }
  }
  console.log(`  Created AI session(s) with ${aiMessageCount} message(s)`);

  // ── WORKFLOWS ─────────────────────────────────────
  console.log("Creating workflows...");
  const workflowDefs = [
    {
      name: "Auto-assign new leads",
      trigger: "LEAD_CREATED",
      actions: [
        { type: "ASSIGN_USER", config: { strategy: "round_robin" }, order: 1 },
        { type: "SEND_NOTIFICATION", config: { channel: "email", template: "new_lead_assigned" }, order: 2 },
      ],
    },
    {
      name: "Deal stage notification",
      trigger: "DEAL_STAGE_CHANGED",
      actions: [
        { type: "SEND_NOTIFICATION", config: { channel: "slack", template: "deal_stage_update" }, order: 1 },
        { type: "UPDATE_FIELD", config: { field: "probability", autoCalculate: true }, order: 2 },
      ],
    },
    {
      name: "Overdue task reminder",
      trigger: "TASK_OVERDUE",
      actions: [
        { type: "SEND_NOTIFICATION", config: { channel: "email", template: "task_overdue_reminder" }, order: 1 },
        { type: "ESCALATE", config: { escalateTo: "manager", afterHours: 24 }, order: 2 },
      ],
    },
  ];
  let workflowActionCount = 0;
  for (const def of workflowDefs) {
    const workflow = await prisma.workflow.create({
      data: {
        name: def.name,
        trigger: def.trigger,
        isActive: true,
        createdBy: admin.id,
      },
    });
    for (const action of def.actions) {
      await prisma.workflowAction.create({
        data: {
          workflowId: workflow.id,
          type: action.type,
          config: action.config,
          order: action.order,
        },
      });
      workflowActionCount++;
    }
  }
  console.log(`  Created ${workflowDefs.length} workflow(s) with ${workflowActionCount} action(s)`);

  // ── NOTIFICATIONS ─────────────────────────────────
  console.log("Creating notifications...");
  let notificationCount = 0;
  const notificationTemplates = [
    { title: "New lead assigned", message: "Ahmad Fauzi telah ditugaskan kepada Anda.", type: "LEAD_CREATED" },
    { title: "Deal updated", message: "Deal 'Enterprise License' telah dipindah ke tahap NEGOTIATION.", type: "DEAL_UPDATE" },
    { title: "Task due tomorrow", message: "Follow up dengan CV Sukses Mandiri jatuh tempo besok.", type: "TASK_ASSIGNED" },
    { title: "Payment received", message: "Pembayaran untuk Invoice #INV-001 telah diterima.", type: "SYSTEM" },
    { title: "Team invite", message: "Anda telah diundang ke tim Marketing Team.", type: "TEAM_INVITE" },
    { title: "Activity reminder", message: "Meeting dengan PT Teknologi Nusantara dalam 2 jam.", type: "ACTIVITY_REMINDER" },
  ];
  for (const user of users) {
    const count = randomInt(1, 3);
    const shuffled = [...notificationTemplates].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      const tpl = shuffled[i];
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: tpl.title,
          message: tpl.message,
          type: tpl.type,
          read: Math.random() > 0.5,
        },
      });
      notificationCount++;
    }
  }
  console.log(`  Created ${notificationCount} notification(s)`);

  // ── SUMMARY ───────────────────────────────────────
  console.log("\nSeed complete! Summary:");
  console.log(`  Users:           ${users.length} (existing)`);
  console.log(`  Teams:           ${teams.length}`);
  console.log(`  Team Members:    ${teamMemberRecords.length}`);
  console.log(`  Subscriptions:   ${subscriptions.length}`);
  console.log(`  Pipelines:       ${pipelines.length}`);
  console.log(`  Contacts:        ${contacts.length}`);
  console.log(`  Leads:           ${leads.length}`);
  console.log(`  Deals:           ${deals.length}`);
  console.log(`  Activities:      ${activities.length}`);
  console.log(`  Tasks:           ${tasks.length}`);
  console.log(`  Invoices:        ${invoices.length}`);
  console.log(`  Invoice Items:   ${invoiceItemCount}`);
  console.log(`  Payments:        ${paymentCount}`);
  console.log(`  AI Sessions:     3`);
  console.log(`  AI Messages:     ${aiMessageCount}`);
  console.log(`  Workflows:       ${workflowDefs.length}`);
  console.log(`  Workflow Actions:${workflowActionCount}`);
  console.log(`  Notifications:   ${notificationCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
