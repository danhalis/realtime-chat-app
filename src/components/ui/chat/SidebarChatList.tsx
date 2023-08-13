"use client";
import { getChatId } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import useSWR from "swr";

interface Props {
  userId: string;
  friends: User[];
}

function SidebarChatList({ userId, friends: friendsFromServer }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [friends, setFriends] = useState<User[]>(friendsFromServer);
  // const {
  //   data: friends,
  //   error,
  //   isLoading,
  // } = useSWR("/api/friends", (url) =>
  //   axios.get<User[]>(url).then((res) => res.data)
  // );
  // if (error) return <div>failed to load</div>;
  // if (!friends) return <div>loading...</div>;

  return (
    <ul className="space-y-1 max-h-[25rem] overflow-y-auto" role="list">
      {friends.sort().map((friend) => {
        return (
          <li>
            <Link
              className="group
                flex items-center gap-3
                rounded-md p-2
                text-sm text-gray-700 font-semibold leading-6
                hover:text-indigo-600 hover:bg-gray-50
                "
              href={`/dashboard/chat/${getChatId(userId, friend.id)}`}
            >
              <Image
                className="rounded-full"
                src={friend.image || ""}
                width={30}
                height={30}
                referrerPolicy="no-referrer"
                alt="Profile Picture"
              />
              <span className="truncate">{friend.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default SidebarChatList;
