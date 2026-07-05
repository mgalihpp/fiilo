import { activitiesRouter } from "./procedures/activities";
import { contactsRouter } from "./procedures/contacts";
import { exampleRouter } from "./procedures/example";
import { leadsRouter } from "./procedures/leads";

export const appRouter = {
  example: exampleRouter,
  contacts: contactsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
};

export type AppRouter = typeof appRouter;
