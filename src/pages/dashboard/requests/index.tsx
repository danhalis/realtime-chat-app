import FriendRequestList from "@/components/ui/FriendRequestList";
import axios from "axios";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import React from "react";
import useSWR from "swr";

function FriendRequestPage() {
  const { data: session, status } = useSession();

  if (!session) {
    notFound();
  }

  const {
    data: friendRequestSenders,
    error,
    isLoading,
  } = useSWR("/api/friends/requests/list", (url) =>
    axios.get<User[]>(url).then((res) => res.data)
  );

  console.log(friendRequestSenders);

  return (
    <main className="pt-8">
      <h1 className="text-5xl font-bold mb-8">Incoming friend requests</h1>
      <FriendRequestList friendRequests={friendRequestSenders?.map<IncomingFriendRequest>((friendRequestSender) => {
        return {
          senderId: friendRequestSender.id,
          senderEmail: friendRequestSender.email,
          senderImage: friendRequestSender.image,
        }
      })} />
    </main>
  );
}

FriendRequestPage.auth = {
  // loading: <p>Authenticating ...</p>,
  redirect: "/signin",
};

export default FriendRequestPage;
