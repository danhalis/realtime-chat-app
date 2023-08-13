import { db, getFriendIdsByUserId, getFriendsByUserId, getUserByUserId } from "@/lib/data/db";
import { getUserIdsFromChatId } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { messageValidator } from "@/lib/validations/message";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { text, chatId }: { text: string, chatId: string } = await req.json();

    const [userId1, userId2] = getUserIdsFromChatId(chatId);
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;
    const friendIds = await getFriendIdsByUserId(session.user.id);
    if (!friendIds.includes(friendId)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sender = await getUserByUserId(session.user.id);
    console.log("Sender", sender);

    const timeStamp = Date.now();
    const message: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text,
      timeStamp
    }
    const validatedMessage = messageValidator.parse(message);
    await db.zadd(`chat:${chatId}:messages`,
      {
        score: timeStamp,
        member: JSON.stringify(validatedMessage),
      }
    )
    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
