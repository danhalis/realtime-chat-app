import { db } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

interface DynamicParams {
  senderId: string;
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
export async function POST(req: Request, context: { params: DynamicParams }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const senderId = context.params.senderId;
    console.log(senderId);

    if (!senderId) {
      return new Response("This user does not exist.", { status: 400 });
    }

    if (senderId === session.user.id) {
      return new Response("You can not add yourself.", { status: 400 });
    }

    const legitFriendRequest = Boolean(await db.sismember(`user:${session.user.id}:incoming_friend_requests`, senderId));

    if (!legitFriendRequest) {
      return new Response("This user did not send you any friend request.", {
        status: 400,
      });
    }

    const friendAlreadyAdded = Boolean(await db.sismember(`user:${session.user.id}:friends`, senderId));

    if (friendAlreadyAdded) {
      return new Response("You are already friend with this user.", {
        status: 400,
      });
    }

    await db.sadd(`user:${session.user.id}:friends`, senderId);
    await db.sadd(`user:${senderId}:friends`, session.user.id);
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, senderId);

    return new Response("OK");
  } catch (error) {
    return new Response("Invalid request", { status: 400 });
  }
}
