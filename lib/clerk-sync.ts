import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncClerkUser(clerkUserId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existing) return existing;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    "User";

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: {
      email,
      name,
      avatar: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUserId,
      email,
      name,
      avatar: clerkUser.imageUrl,
    },
  });
}

export async function getAuthContext() {
  const { userId } = await auth();

  if (userId) {
    await syncClerkUser(userId);
  }

  return { userId };
}
