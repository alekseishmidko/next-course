"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Главная" },
  { href: "/dashboard/settings", label: "Настройки" },
  { href: "/dashboard/error", label: "Error" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/user/test", label: "Users" },
];

export default function Sidebar() {
  const [text, setText] = useState("");
  const pathName = usePathname();
  return (
    <aside className="w-64 bg-blue-50 p-6 border-r border-blue-100 flex flex-col">
      <div className="mb-8 text-xs font-bold text-blue-500 uppercase tracking-widest font-sans">
        Dashboard Layout
      </div>

      <nav className="flex flex-col gap-4 text-zinc-400">
        <span className="font-bold text-sm text-zinc-400">Навигация</span>

        {menuItems.map((menuItem) => (
          <Link
            key={menuItem.href}
            href={menuItem.href}
            className={`hover:text-blue-600 transition-colors ${menuItem.href === pathName ? "text-blue-500" : "text-gray-400"}`}
          >
            {menuItem.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-blue-200">
        <label className="block text-[10px] font-bold text-blue-400 uppercase mb-2">
          Persistent State (Layout)
        </label>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст сохранится..."
          className="
      w-full
      p-2
      text-sm
      border
      border-blue-200
      rounded
      bg-white
      text-black
      focus:ring-2
      focus:ring-blue-500
      outline-none
    "
        />
      </div>
    </aside>
  );
}
