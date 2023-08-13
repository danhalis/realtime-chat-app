import React, { Suspense } from "react";
import { Icon, Icons } from "@/components/Icons";
import Link from "next/link";

interface Props {
  key: React.Key | null | undefined;
  name: string;
  href: string;
  icon: Icon;
  fetchItemCount?: () => Promise<number>;
}

async function NumberBadge({
  fetchItemCount,
}: {
  fetchItemCount?: () => Promise<number>;
}) {
  let itemCount = 0;
  if (fetchItemCount) {
    itemCount = await fetchItemCount();
  }
  return (
    <>
      {itemCount > 0 ? <span className="number-badge">{itemCount}</span> : null}
    </>
  );
}

async function SidebarOption({ key, name, href, icon, fetchItemCount }: Props) {
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
        <Suspense>
          <NumberBadge fetchItemCount={fetchItemCount} />
        </Suspense>
      </Link>
    </li>
  );
}

export default SidebarOption;
