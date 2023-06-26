import { Icon, Icons } from "@/components/Icons";
import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}
const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    icon: "UserPlus",
  },
];

function DashboardLayout({ children }: Props) {
  return (
    <div className="w-full h-screen flex">
      <div
        className="w-full max-w-xs h-full
        flex flex-col grow gap-y-5
        overflow-y-auto
        border-r border-gray-200
        bg-white
        px-6"
      >
        <Link
          className="h-16
        flex shrink-0 items-center"
          href="/dashboard"
        >
          <Icons.Logo className="w-auto h-8 text-indigo-600" />
        </Link>

        <div className="text-xs font-semibold text-gray-400 leading-6">
          Your chats
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7" role="list">
            <li>// chats</li>
            <li>
              <div className="text-xs font-semibold text-gray-400 leading-6">
                Overview
              </div>

              <ul className="-mx-2 mt-2 space-y-1" role="list">
                {sidebarOptions.map((sidebarOption) => {
                  const Icon = Icons[sidebarOption.icon];
                  return (
                    <li key={sidebarOption.id}>
                      <Link
                        href={sidebarOption.href}
                        className="group
                        flex gap-3
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
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}

export default DashboardLayout;
