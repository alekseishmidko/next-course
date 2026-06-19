"use client";

import { ReactNode, useEffect, useState } from "react";

/**
 * Описывает свойства template-компонента дашборда.
 *
 * @property children Контент текущей дочерней страницы внутри сегмента `/dashboard`.
 */
interface DashboardTemplateInterface {
  children: ReactNode;
}

/**
 * Клиентский template для раздела `/dashboard`.
 *
 * Показывает отдельную обертку с input и демонстрирует поведение `template.tsx`: компонент
 * пересоздается при навигации между дочерними маршрутами, поэтому его локальное состояние
 * сбрасывается.
 */
export default function DashboardTemplate({ children }: DashboardTemplateInterface) {
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("DashboardTemplate монтирование");
  }, []);
  return (
    <div className="border border-pink-500 rounded-xl m-4 overflow-hidden flex h-dvh">
      <aside className="w-64 bg-pink-50 p-6 border-r border-pink-100 flex flex-col">
        <div className="mb-8 text-xs font-bold text-pink-500 uppercase tracking-widest font-sans">
          Dashboard Template
        </div>

        <div className="mt-auto pt-6 border-t border-pink-200">
          <label className="block text-[10px] font-bold text-pink-400 uppercase mb-2">
            Persistent State (Template)
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
      border-pink-200
      rounded
      bg-white
      text-black
      focus:ring-2
      focus:ring-pink-500
      outline-none
    "
          />
        </div>
      </aside>

      <main className="flex-1 p-8 bg-white flex flex-col">{children}</main>
    </div>
  );
}
