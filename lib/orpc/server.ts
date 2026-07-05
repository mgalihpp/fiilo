import { activitiesRouter } from "./procedures/activities";
import { contactsRouter } from "./procedures/contacts";
import { dealsRouter } from "./procedures/deals";
import { exampleRouter } from "./procedures/example";
import { leadsRouter } from "./procedures/leads";
import { pipelineRouter } from "./procedures/pipeline";

export const appRouter = {
  example: exampleRouter,
  contacts: contactsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
  deals: dealsRouter,
  pipeline: pipelineRouter,
};

export type AppRouter = typeof appRouter;
