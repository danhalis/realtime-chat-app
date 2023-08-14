"use client"
import React, { Suspense } from "react";
import { Icon, Icons } from "@/components/Icons";
import Link from "next/link";
import NumberBadge from "./NumberBadge";

export interface SidebarOptionProps {
  key: React.Key | null | undefined;
  name: string;
  href: string;
  icon: Icon;
  itemCount?: number;
}

function SidebarOption({ key, name, href, icon, itemCount = 0 }: SidebarOptionProps) {
  const Icon = Icons[icon];

  return (
    <li key={key}>
      <Link
        href={href}
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

        <span className="truncate">{name}</span>
        <NumberBadge number={itemCount} />
      </Link>
    </li>
  );
}

export default SidebarOption;
