import { prisma } from "../../prisma";
import { DEAL_STAGES } from "../../schemas/deal";
import { userProcedure } from "../context";

// Deals require a pipeline, and a pipeline requires a team. A solo user has
// neither on first use, so we lazily provision a personal team + default
// pipeline. Idempotent: subsequent calls reuse the existing rows.
export async function getOrCreateDefaultPipeline(userId: string) {
  let team = await prisma.team.findFirst({ where: { ownerId: userId } });
  if (!team) {
    team = await prisma.team.create({
      data: { name: "My Workspace", ownerId: userId },
    });
  }

  let pipeline = await prisma.pipeline.findFirst({
    where: { teamId: team.id },
  });
  if (!pipeline) {
    pipeline = await prisma.pipeline.create({
      data: {
        name: "Sales Pipeline",
        teamId: team.id,
        stages: [...DEAL_STAGES],
      },
    });
  }

  return pipeline;
}

const getDefault = userProcedure.handler(async ({ context }) => {
  const pipeline = await getOrCreateDefaultPipeline(context.user.id);
  return pipeline;
});

export const pipelineRouter = { getDefault };
