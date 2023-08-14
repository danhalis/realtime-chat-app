import FriendRequestList from "@/components/ui/friends/FriendRequestList";
import { db, getFriendRequestSendersByUserId } from "@/lib/data/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

async function FriendRequestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const friendRequestSenders = await getFriendRequestSendersByUserId(session.user.id);

  return (
    <FriendRequestList userId={session.user.id} friendRequests={
      friendRequestSenders?.map<IncomingFriendRequest>((friendRequestSender) => {
      return {
        senderId: friendRequestSender!.id,
        senderEmail: friendRequestSender!.email,
        senderImage: friendRequestSender!.image,
      }
    })} />
  );
}

export default FriendRequestPage;
