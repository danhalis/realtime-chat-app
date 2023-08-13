import { db, getUsersByUserIds } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendIds = (await db.smembers(
      `user:${session.user.id}:friends`,
    ));

    const friends = await getUsersByUserIds(friendIds);

    return new Response(JSON.stringify(friends), { status: 200 });
  } catch (error) {
    return new Response("Invalid request payload", { status: 400 });
  }
}