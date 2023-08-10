import { db } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendRequestSenderIds = (await db.smembers(
      `user:${session.user.id}:incoming_friend_requests`,
    ));

    const friendRequestSenders = await Promise.all(
      friendRequestSenderIds.map(async (senderId: string) => db.get<User>(`user:${senderId}`))
    );

    return new Response(JSON.stringify(friendRequestSenders), { status: 200 });
  } catch (error) {
    return new Response("Invalid request payload", { status: 400 });
  }
}