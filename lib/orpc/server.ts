import { activitiesRouter } from "./procedures/activities";
import { aiRouter } from "./procedures/ai";
import { contactsRouter } from "./procedures/contacts";
import { dealsRouter } from "./procedures/deals";
import { exampleRouter } from "./procedures/example";
import { invoicesRouter } from "./procedures/invoices";
import { leadsRouter } from "./procedures/leads";
import { paymentsRouter } from "./procedures/payments";
import { pipelineRouter } from "./procedures/pipeline";
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
};

export type AppRouter = typeof appRouter;
