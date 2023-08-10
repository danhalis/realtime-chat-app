import { db } from "@/lib/data/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // const idToAdd = await redisFetch("get", `user:email:${emailToAdd}`) as string;
    const idToAdd = await db.get<string>(`user:email:${emailToAdd}`);
    console.log(idToAdd);

    if (!idToAdd) {
      return new Response("This user does not exist.", { status: 400 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You can not add yourself.", { status: 400 });
    }

    const friendRequestAlreadySent = Boolean(await db.sismember(`user:${idToAdd}:incoming_friend_requests`, session.user.id));

    if (friendRequestAlreadySent) {
      return new Response("You already sent a friend request to this user.", {
        status: 400,
      });
    }

    const receivedFriendRequestFromTheSamePerson = Boolean(await db.sismember(`user:${session.user.id}:incoming_friend_requests`, idToAdd));

    if (receivedFriendRequestFromTheSamePerson) {
      return new Response("This person already sent you a friend request.", {
        status: 400,
      });
    }

    const friendAlreadyAdded = Boolean(await db.sismember(`user:${session.user.id}:friends`, idToAdd));

    if (friendAlreadyAdded) {
      return new Response("You are already friend with this user.", {
        status: 400,
      });
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
