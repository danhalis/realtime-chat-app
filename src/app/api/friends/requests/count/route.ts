import { db } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendRequestCount = (await db.smembers(
      `user:${session.user.id}:incoming_friend_requests`,
    )).length;

    return new Response(JSON.stringify(friendRequestCount), { status: 200 });
  } catch (error) {
    return new Response("Invalid request payload", { status: 400 });
  }
}