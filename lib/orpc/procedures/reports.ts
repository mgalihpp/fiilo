import { z } from "zod";
import { prisma } from "../../prisma";
import { userProcedure } from "../context";

// Input schemas
const dateRangeInput = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
const getDashboardStats = userProcedure
  .input(dateRangeInput)
  .handler(async ({ input, context }) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = input.startDate || monthAgo;
    const endDate = input.endDate || now;

    // Total revenue (from won invoices)
    const invoices = await prisma.invoice.findMany({
      where: {
        createdBy: context.user.id,
        status: "PAID",
        createdAt: { gte: startDate, lte: endDate },
      },
    });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

    // Total contacts
    const totalContacts = await prisma.contact.count({
      where: { createdBy: context.user.id },
    });

    // Total deals
    const totalDeals = await prisma.deal.count({
      where: { createdBy: context.user.id },
    });

    // Total leads
    const totalLeads = await prisma.lead.count({
      where: { contact: { createdBy: context.user.id } },
    });

    // Deals in pipeline (not won/lost)
    const pipelineDeals = await prisma.deal.findMany({
      where: {
        createdBy: context.user.id,
        stage: { notIn: ["WON", "LOST"] },
      },
    });
    const pipelineValue = pipelineDeals.reduce((sum, d) => sum + d.value, 0);

    // Recent activities count
    const recentActivities = await prisma.activity.count({
      where: {
        performedBy: context.user.id,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // Previous month revenue (for comparison)
    const prevMonthStart = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prevMonthEnd = startDate;
    const prevInvoices = await prisma.invoice.findMany({
      where: {
        createdBy: context.user.id,
        status: "PAID",
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    });
    const prevRevenue = prevInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalContacts,
      totalDeals,
      totalLeads,
      pipelineValue,
      recentActivities,
      prevRevenue,
      revenueGrowth,
    };
  });

// ─── Revenue Chart Data ──────────────────────────────────────────────────────
const getRevenueData = userProcedure
  .input(dateRangeInput.extend({ groupBy: z.enum(["day", "week", "month"]).optional() }))
  .handler(async ({ input, context }) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = input.startDate || monthAgo;
    const endDate = input.endDate || now;
    const groupBy = input.groupBy || "day";

    const invoices = await prisma.invoice.findMany({
      where: {
        createdBy: context.user.id,
        status: "PAID",
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by day/week/month
    const grouped: Record<string, number> = {};
    invoices.forEach((inv) => {
      const date = new Date(inv.createdAt);
      let key: string;

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "week") {
        const week = Math.floor((date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        key = `Week ${week + 1}`;
      } else {
        key = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
      }

      grouped[key] = (grouped[key] || 0) + inv.total;
    });

    return Object.entries(grouped).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  });

// ─── Deal Pipeline Data ──────────────────────────────────────────────────────
const getDealPipelineData = userProcedure.handler(async ({ context }) => {
  const deals = await prisma.deal.findMany({
    where: { createdBy: context.user.id },
    select: { stage: true, value: true },
  });

  // Group by stage
  const grouped: Record<string, { count: number; value: number }> = {};
  deals.forEach((d) => {
    if (!grouped[d.stage]) {
      grouped[d.stage] = { count: 0, value: 0 };
    }
    grouped[d.stage].count += 1;
    grouped[d.stage].value += d.value;
  });

  return Object.entries(grouped).map(([stage, data]) => ({
    stage,
    count: data.count,
    value: data.value,
  }));
});

// ─── Activity Feed ───────────────────────────────────────────────────────────
const getActivityFeed = userProcedure
  .input(z.object({ limit: z.number().default(10) }))
  .handler(async ({ input, context }) => {
    const activities = await prisma.activity.findMany({
      where: { performedBy: context.user.id },
      orderBy: { createdAt: "desc" },
      take: input.limit,
      include: {
        lead: { include: { contact: true } },
        deal: true,
        performer: true,
      },
    });

    return activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      leadName: a.lead?.contact.name,
      dealName: a.deal?.title,
      createdAt: a.createdAt,
    }));
  });

// ─── Sales by Rep ───────────────────────────────────────────────────────────
const getSalesByRep = userProcedure
  .input(dateRangeInput)
  .handler(async ({ input, context }) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = input.startDate || monthAgo;
    const endDate = input.endDate || now;

    const deals = await prisma.deal.findMany({
      where: {
        createdBy: context.user.id,
        createdAt: { gte: startDate, lte: endDate },
        stage: "WON",
      },
      include: { assignee: true },
    });

    // Group by assignee
    const grouped: Record<string, { count: number; value: number }> = {
      Unassigned: { count: 0, value: 0 },
    };

    deals.forEach((d) => {
      const name = d.assignee?.name || "Unassigned";
      if (!grouped[name]) {
        grouped[name] = { count: 0, value: 0 };
      }
      grouped[name].count += 1;
      grouped[name].value += d.value;
    });

    return Object.entries(grouped).map(([rep, data]) => ({
      rep,
      deals: data.count,
      revenue: data.value,
    }));
  });

// ─── Win Rate ───────────────────────────────────────────────────────────────
const getWinRate = userProcedure
  .input(dateRangeInput)
  .handler(async ({ input, context }) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = input.startDate || monthAgo;
    const endDate = input.endDate || now;

    const deals = await prisma.deal.findMany({
      where: {
        createdBy: context.user.id,
        createdAt: { gte: startDate, lte: endDate },
        stage: { in: ["WON", "LOST"] },
      },
      select: { stage: true },
    });

    const won = deals.filter((d) => d.stage === "WON").length;
    const lost = deals.filter((d) => d.stage === "LOST").length;
    const total = won + lost;
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return {
      won,
      lost,
      total,
      winRate,
    };
  });

export const reportsRouter = {
  getDashboardStats,
  getRevenueData,
  getDealPipelineData,
  getActivityFeed,
  getSalesByRep,
  getWinRate,
};
