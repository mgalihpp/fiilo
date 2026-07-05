import { activitiesRouter } from "./procedures/activities";
import { contactsRouter } from "./procedures/contacts";
import { dealsRouter } from "./procedures/deals";
import { exampleRouter } from "./procedures/example";
import { leadsRouter } from "./procedures/leads";
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
};

export type AppRouter = typeof appRouter;
