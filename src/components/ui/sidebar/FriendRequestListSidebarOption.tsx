"use client"
import React, { Suspense, useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import Link from "next/link";
import { PusherEvent, pusherClient } from "@/lib/pusher";
import SidebarOption, { SidebarOptionProps } from "./SidebarOption";

interface Props extends SidebarOptionProps {
  userId: string;
}

function FriendRequestListSidebarOption({ key, userId, name, href, icon, itemCount = 0 }: Props) {
  const [incomingFriendRequestCount, setIncomingFriendRequestCount] = useState<number>(itemCount);

  useEffect(() => {
    const channelName = `user_${userId}_incoming_friend_requests`;

    const onFriendRequest = () => {
      setIncomingFriendRequestCount((prev) => prev + 1);
    }
    pusherClient.subscribe(channelName);
    pusherClient.bind(PusherEvent.IncomingFriendRequests, onFriendRequest);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind(PusherEvent.IncomingFriendRequests, onFriendRequest);
    };
  }, []);

  return (
    <SidebarOption
      key={key}
      name={name}
      href={href}
      icon={icon}
      itemCount={incomingFriendRequestCount}
    />
  );
}

export default FriendRequestListSidebarOption;
