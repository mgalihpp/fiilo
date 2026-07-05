import { activitiesRouter } from "./procedures/activities";
import { aiRouter } from "./procedures/ai";
import { chatRouter } from "./procedures/chat";
import { contactsRouter } from "./procedures/contacts";
import { dealsRouter } from "./procedures/deals";
import { exampleRouter } from "./procedures/example";
import { invoicesRouter } from "./procedures/invoices";
import { leadsRouter } from "./procedures/leads";
import { paymentsRouter } from "./procedures/payments";
import { pipelineRouter } from "./procedures/pipeline";
import { reportsRouter } from "./procedures/reports";
import { teamRouter } from "./procedures/team";
import { tasksRouter } from "./procedures/tasks";

export const appRouter = {
  example: exampleRouter,
  contacts: contactsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
  deals: dealsRouter,
  pipeline: pipelineRouter,
  tasks: tasksRouter,
  invoices: invoicesRouter,
  payments: paymentsRouter,
  ai: aiRouter,
  chat: chatRouter,
  reports: reportsRouter,
  team: teamRouter,
};

export type AppRouter = typeof appRouter;
