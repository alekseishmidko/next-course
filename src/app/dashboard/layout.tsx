"use client";

import { ReactNode } from "react";

import Sidebar from "@/shared/components/sidebar";

/**
 * Описывает свойства layout-компонента дашборда.
 *
 * @property children Дочерние страницы и вложенные сегменты маршрута `/dashboard`.
 */
interface DashboardLayoutInterface {
  children: ReactNode;
}

/**
 *   layout для раздела `/dashboard`.
 *
 * Отрисовывает боковую навигацию, область для дочерней страницы и input с локальным состоянием.
 * Так как это `layout.tsx`, компонент сохраняет состояние при клиентской навигации внутри сегмента
 * `/dashboard`, например между `/dashboard`, `/dashboard/settings` и вложенными страницами
 * пользователей.
 */
export default function DashboardLayout({ children }: DashboardLayoutInterface) {
  return (
    <div className="border border-blue-500 rounded-xl m-4 overflow-hidden flex h-dvh">
      <Sidebar />

      <main className="flex-1 p-8 bg-white flex flex-col">{children}</main>
    </div>
  );
}
