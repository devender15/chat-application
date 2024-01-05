import { db } from "./db";

export async function findIdFromUid(userId?: string, email?: string) {
  const profile = await db.profile.findFirst({
    where: {
      OR: [{ userId: userId }, { email: email }, { id: userId }],
    },
  });

  if (!profile) return null;

  return profile;
}
