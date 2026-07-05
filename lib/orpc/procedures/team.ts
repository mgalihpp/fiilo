import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { prisma } from "../../prisma";
import { adminProcedure, userProcedure } from "../context";

// Input schemas
const memberIdInput = z.object({ id: z.string() });
const inviteInput = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).default("USER"),
});
const updateRoleInput = z.object({
  id: z.string(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
});

// ─── List team members ───────────────────────────────────────────────────────
const listTeam = userProcedure.handler(async ({ context }) => {
  // Get or create user's default team
  let team = await prisma.team.findFirst({
    where: { ownerId: context.user.id },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: `${context.user.name}'s Team`,
        ownerId: context.user.id,
      },
    });
  }

  // Get all team members
  const members = await prisma.teamMember.findMany({
    where: { teamId: team.id },
    include: { user: true },
    orderBy: { joinedAt: "asc" },
  });

  // Include the owner
  const ownerData = await prisma.user.findUnique({
    where: { id: context.user.id },
  });

  const allMembers = [
    {
      id: ownerData!.id,
      email: ownerData!.email,
      name: ownerData!.name,
      role: "ADMIN",
      avatar: ownerData!.avatar,
      joinedAt: ownerData!.createdAt,
    },
    ...members.map((m) => ({
      id: m.user.id,
      email: m.user.email,
      name: m.user.name,
      role: m.role,
      avatar: m.user.avatar,
      joinedAt: m.joinedAt,
    })),
  ];

  // Remove duplicates (in case owner was also in TeamMember)
  const unique = Array.from(
    new Map(allMembers.map((item) => [item.id, item])).values(),
  );

  return { teamId: team.id, members: unique };
});

// ─── Invite member ──────────────────────────────────────────────────────────
const inviteMember = adminProcedure
  .input(inviteInput)
  .handler(async ({ input, context }) => {
    // Get or create user's team
    let team = await prisma.team.findFirst({
      where: { ownerId: context.user.id },
    });

    if (!team) {
      team = await prisma.team.create({
        data: {
          name: `${context.user.name}'s Team`,
          ownerId: context.user.id,
        },
      });
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!invitedUser) {
      throw new ORPCError("NOT_FOUND", { message: "User not found with that email" });
    }

    // Check if already a member
    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: team.id, userId: invitedUser.id } },
    });

    if (existing) {
      throw new ORPCError("BAD_REQUEST", { message: "User is already a team member" });
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: invitedUser.id,
        role: input.role,
      },
    });

    return {
      success: true,
      memberId: member.id,
    };
  });

// ─── Remove member ──────────────────────────────────────────────────────────
const removeMember = adminProcedure
  .input(memberIdInput)
  .handler(async ({ input, context }) => {
    // Get user's team
    const team = await prisma.team.findFirst({
      where: { ownerId: context.user.id },
    });

    if (!team) {
      throw new ORPCError("NOT_FOUND", { message: "Team not found" });
    }

    // Verify member belongs to team
    const member = await prisma.teamMember.findFirst({
      where: { id: input.id, teamId: team.id },
    });

    if (!member) {
      throw new ORPCError("NOT_FOUND", { message: "Team member not found" });
    }

    // Prevent removing self
    if (member.userId === context.user.id) {
      throw new ORPCError("BAD_REQUEST", { message: "Cannot remove yourself from team" });
    }

    await prisma.teamMember.delete({ where: { id: input.id } });

    return { success: true };
  });

// ─── Update member role ─────────────────────────────────────────────────────
const updateRole = adminProcedure
  .input(updateRoleInput)
  .handler(async ({ input, context }) => {
    // Get user's team
    const team = await prisma.team.findFirst({
      where: { ownerId: context.user.id },
    });

    if (!team) {
      throw new ORPCError("NOT_FOUND", { message: "Team not found" });
    }

    // Verify member belongs to team
    const member = await prisma.teamMember.findFirst({
      where: {
        userId: input.id,
        teamId: team.id,
      },
    });

    if (!member) {
      throw new ORPCError("NOT_FOUND", { message: "Team member not found" });
    }

    // Prevent changing owner's role
    if (input.id === context.user.id) {
      throw new ORPCError("BAD_REQUEST", { message: "Cannot change your own role" });
    }

    await prisma.teamMember.update({
      where: { id: member.id },
      data: { role: input.role },
    });

    return { success: true };
  });

export const teamRouter = {
  listTeam,
  inviteMember,
  removeMember,
  updateRole,
};
