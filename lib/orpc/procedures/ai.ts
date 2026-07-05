import { ORPCError } from "@orpc/server";
import { generateObject } from "ai";
import { smartModel } from "../../ai";
import { prisma } from "../../prisma";
import {
  aiIdInput,
  dealForecastOutput,
  enrichOutput,
  leadScoreOutput,
  suggestOutput,
} from "../../schemas/ai";
import { userProcedure } from "../context";

// Score a lead 0-100 from its contact, activity and deal history, then persist.
const scoreLead = userProcedure
  .input(aiIdInput)
  .handler(async ({ input, context }) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.id, contact: { createdBy: context.user.id } },
      include: { contact: true, activities: true, deals: true },
    });
    if (!lead) throw new ORPCError("NOT_FOUND", { message: "Lead not found" });

    const { object } = await generateObject({
      model: smartModel,
      schema: leadScoreOutput,
      prompt: `Score this sales lead 0-100 on likelihood to convert. Consider company fit, engagement and deal history.\n\n${JSON.stringify(
        {
          company: lead.contact.company,
          position: lead.contact.position,
          status: lead.status,
          source: lead.source,
          activities: lead.activities.length,
          deals: lead.deals.map((d) => ({ stage: d.stage, value: d.value })),
        },
      )}`,
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { score: object.score },
    });
    return object;
  });

// Predict a deal's close probability and risk, then persist probability.
const forecastDeal = userProcedure
  .input(aiIdInput)
  .handler(async ({ input, context }) => {
    const deal = await prisma.deal.findFirst({
      where: { id: input.id, createdBy: context.user.id },
      include: { lead: { include: { contact: true } }, activities: true },
    });
    if (!deal) throw new ORPCError("NOT_FOUND", { message: "Deal not found" });

    const { object } = await generateObject({
      model: smartModel,
      schema: dealForecastOutput,
      prompt: `Estimate the probability (0-100) this deal closes won, plus risk level. \n\n${JSON.stringify(
        {
          stage: deal.stage,
          value: deal.value,
          expectedCloseDate: deal.expectedCloseDate,
          activities: deal.activities.length,
          company: deal.lead?.contact.company,
        },
      )}`,
    });

    await prisma.deal.update({
      where: { id: deal.id },
      data: { probability: object.probability },
    });
    return object;
  });

// Enrich a contact with inferred company insights; store in Contact.enrichedData.
const enrichContact = userProcedure
  .input(aiIdInput)
  .handler(async ({ input, context }) => {
    const contact = await prisma.contact.findFirst({
      where: { id: input.id, createdBy: context.user.id },
    });
    if (!contact)
      throw new ORPCError("NOT_FOUND", { message: "Contact not found" });

    const { object } = await generateObject({
      model: smartModel,
      schema: enrichOutput,
      prompt: `Infer likely company insights for this contact. Be concise; mark unknowns as "Unknown".\n\n${JSON.stringify(
        {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          position: contact.position,
        },
      )}`,
    });

    await prisma.contact.update({
      where: { id: contact.id },
      data: { enrichedData: object },
    });
    return object;
  });

// Suggest up to 5 next actions for a lead.
const suggest = userProcedure
  .input(aiIdInput)
  .handler(async ({ input, context }) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.id, contact: { createdBy: context.user.id } },
      include: { contact: true, activities: true, deals: true },
    });
    if (!lead) throw new ORPCError("NOT_FOUND", { message: "Lead not found" });

    const { object } = await generateObject({
      model: smartModel,
      schema: suggestOutput,
      prompt: `Suggest up to 5 concrete next sales actions for this lead.\n\n${JSON.stringify(
        {
          company: lead.contact.company,
          status: lead.status,
          score: lead.score,
          activities: lead.activities.length,
          deals: lead.deals.length,
        },
      )}`,
    });
    return object;
  });

export const aiRouter = { scoreLead, forecastDeal, enrichContact, suggest };
