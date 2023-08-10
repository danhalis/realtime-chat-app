import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  friendRequests?: IncomingFriendRequest[];
}
function FriendRequestList({ friendRequests }: Props) {
  const router = useRouter();
  return <div>
    {!friendRequests || friendRequests.length === 0 ? (
      <p className="text-sm text-zinc-500">No friend requests</p>
    ) : (
      friendRequests.map((friendRequest, index) => (
        <div key={index} className="flex items-center gap-4">
          <Image
            className="rounded-full"
            src={friendRequest.senderImage || ""}
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            alt="Profile Picture"
          />
          <p className="text-lg font-medium">{friendRequest.senderEmail}</p>
          <button
            className="grid place-items-center w-8 h-8 rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md"
            aria-label="Accept Friend Request"
            onClick={async () => {
              await axios.post(`/api/friends/requests/${friendRequest.senderId}/accept`);
              router.refresh();
            }}
          >
            <Check className="w-3/4 h-3/4 text-white font-semibold" />
          </button>
          <button
            className="grid place-items-center w-8 h-8 rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
            aria-label="Decline Friend Request"
            onClick={async () => {
              await axios.post(`/api/friends/requests/${friendRequest.senderId}/decline`);
              router.refresh();
            }}
          >
            <X className="w-3/4 h-3/4 text-white font-semibold" />
          </button>
        </div>
      ))
    )}
  </div>;
}

export default FriendRequestList;
