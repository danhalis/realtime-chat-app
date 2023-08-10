import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/ui/SignOutButton";
import useSWR from "swr";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
  itemCount?: number;
}

function DashboardLayout({ children }: Props) {
  const { data: session, status } = useSession();

  if (!session) {
    notFound();
  }

  const {
    data: friendRequestCount,
    error,
    isLoading,
  } = useSWR("/api/friends/requests/count", (url) =>
    axios.get(url).then((res) => res.data)
  );

  console.log(friendRequestCount);

  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: "Add friend",
      href: "/dashboard/add",
      icon: "UserPlus",
    },
    {
      id: 2,
      name: "Friend Requests",
      href: "/dashboard/requests",
      icon: "User",
      itemCount: friendRequestCount,
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
            <ul className="flex flex-col gap-y-5" role="list">
              <li>// chats</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 leading-6">
              Overview
            </div>
            <ul className="space-y-1" role="list">
              {sidebarOptions.map((sidebarOption) => {
                const Icon = Icons[sidebarOption.icon];
                return (
                  <li key={sidebarOption.id}>
                    <Link
                      href={sidebarOption.href}
                      className="group
                        flex items-center gap-3
                        rounded-md p-2
                        text-sm text-gray-700 font-semibold leading-6
                        hover:text-indigo-600 hover:bg-gray-50
                        "
                    >
                      <span
                        className="w-6 h-6
                          flex shrink-0 items-center justify-center
                          rounded-lg
                          border border-gray-200
                          text-[0.625rem] text-gray-400 font-medium
                          bg-white
                          group-hover:border-indigo-600 group-hover:text-indigo-600"
                      >
                        <Icon className="w-4 h-4" />
                      </span>

                      <span className="truncate">{sidebarOption.name}</span>
                      {sidebarOption.itemCount &&
                      sidebarOption.itemCount > 0 ? (
                        <div className="number-badge">
                          {sidebarOption.itemCount}
                        </div>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
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
