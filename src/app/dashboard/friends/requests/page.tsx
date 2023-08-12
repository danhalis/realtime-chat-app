import FriendRequestList from "@/components/ui/friends/FriendRequestList";
import { db } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

async function FriendRequestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const friendRequestSenderIds = (await db.smembers(
    `user:${session.user.id}:incoming_friend_requests`,
  ));
  const friendRequestSenders = await Promise.all(
    (friendRequestSenderIds.map(async (senderId: string) => db.get<User>(`user:${senderId}`)).filter((value) => !!value))
  );

  return (
    <main className="pt-8">
      <h1 className="text-5xl font-bold mb-8">Incoming friend requests</h1>
      <FriendRequestList friendRequests={
        friendRequestSenders?.map<IncomingFriendRequest>((friendRequestSender) => {
        return {
          senderId: friendRequestSender!.id,
          senderEmail: friendRequestSender!.email,
          senderImage: friendRequestSender!.image,
        }
      })} />
    </main>
  );
}

export default FriendRequestPage;
