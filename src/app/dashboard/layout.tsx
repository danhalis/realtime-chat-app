import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/ui/auth/SignOutButton";
import useSWR from "swr";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db, getFriendRequestSendersByUserId, getFriendsByUserId } from "@/lib/data/db";
import SidebarChatList from "@/components/ui/chat/SidebarChatList";
import SidebarOption from "@/components/server/SidebarOption";

interface Props {
  children: React.ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
  fetchIconCount?: () => Promise<number>;
}

async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: "Add friend",
      href: "/dashboard/friends/add",
      icon: "UserPlus",
    },
    {
      id: 2,
      name: "Friend Requests",
      href: "/dashboard/friends/requests",
      icon: "User",
      fetchIconCount: async () => (await getFriendRequestSendersByUserId(session.user.id)).length,
    },
  ];

  return (
    <div className="w-full h-screen flex">
      <div className="flex flex-col w-full max-w-xs h-full border-r border-gray-200 bg-white">
        {/* Nav */}
        <div
          className="h-full
          flex flex-col grow gap-y-5
          overflow-y-auto
          px-6"
        >
          <Link
            className="h-16
            flex shrink-0 items-center"
            href="/dashboard"
          >
            <Icons.Logo className="w-auto h-8 text-indigo-600" />
          </Link>

          <div>
            <div className="text-xs font-semibold text-gray-400 leading-6">
              Your chats
            </div>
            <SidebarChatList userId={session.user.id} friends={friends} />
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 leading-6">
              Overview
            </div>
            <ul className="space-y-1" role="list">
              {sidebarOptions.map((sidebarOption) => (
                // <Suspense fallback="loading">
                  <SidebarOption
                    key={sidebarOption.id}
                    href={sidebarOption.href}
                    name={sidebarOption.name}
                    icon={sidebarOption.icon}
                    fetchItemCount={sidebarOption.fetchIconCount}
                  />
                // </Suspense>
              ))}
            </ul>
          </div>
        </div>

        {/* Profile Info */}
        <div
          className="
            justify-between
            flex items-center
            space-x-2
            px-2 py-3
            text-sm text-gray-900 font-semibold leading-6
          "
        >
          <Image
            className="rounded-full"
            src={session.user.image || ""}
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            alt="Profile Picture"
          />
          <span className="sr-only">Your Profile</span>
          <div className="truncate">
            <span className="block truncate" aria-hidden="true">
              {session.user.name}
            </span>
            <span
              className="block truncate text-xs text-zinc-400"
              aria-hidden="true"
            >
              {session.user.email}
            </span>
          </div>
          <SignOutButton className="h-full aspect-square" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default DashboardLayout;
