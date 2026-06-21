"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Описывает свойства layout-компонента дашборда.
 *
 * @property children Дочерние страницы и вложенные сегменты маршрута `/dashboard`.
 */
interface DashboardLayoutInterface {
  children: ReactNode;
}

/**
 * Клиентский layout для раздела `/dashboard`.
 *
 * Отрисовывает боковую навигацию, область для дочерней страницы и input с локальным состоянием.
 * Так как это `layout.tsx`, компонент сохраняет состояние при клиентской навигации внутри сегмента
 * `/dashboard`, например между `/dashboard`, `/dashboard/settings` и вложенными страницами
 * пользователей.
 */
export default function DashboardLayout({ children }: DashboardLayoutInterface) {
  const [text, setText] = useState("");
  const router = useRouter();
  useEffect(() => {
    console.log("DashboardLayout mount");

    return () => {
      console.log("DashboardLayout unmount");
    };
  }, []);
  return (
    <div className="border border-blue-500 rounded-xl m-4 overflow-hidden flex h-dvh">
      <aside className="w-64 bg-blue-50 p-6 border-r border-blue-100 flex flex-col">
        <div className="mb-8 text-xs font-bold text-blue-500 uppercase tracking-widest font-sans">
          Dashboard Layout
        </div>

        <nav className="flex flex-col gap-4 text-zinc-400">
          <span className="font-bold text-sm text-zinc-400">Навигация</span>

          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
            Главная
          </Link>

          <Link href="/dashboard/settings" className="hover:text-blue-600 transition-colors">
            Настройки
          </Link>
          <Link href="/dashboard/error" className="hover:text-blue-600 transition-colors">
            Error
          </Link>
          <Link href="/dashboard/user/test" className="hover:text-blue-600 transition-colors">
            Users
          </Link>
          <button
            onClick={() => router.push("/login")}
            className="hover:text-blue-600 transition-colors"
          >
            Выйти
          </button>
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

      <main className="flex-1 p-8 bg-white flex flex-col">{children}</main>
    </div>
  );
}
