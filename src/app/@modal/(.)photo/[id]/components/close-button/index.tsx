"use client";

import { useRouter } from "next/navigation";

/**
 * Кнопка закрытия intercepted modal.
 *
 * Использует клиентский router и возвращает пользователя на предыдущий маршрут через `router.back()`.
 * Для модального сценария это закрывает overlay и восстанавливает страницу, с которой был переход.
 */
export function CloseButton() {
  const router = useRouter();

  return (
    <button onClick={router.back} className={"text-3xl text-white text-center cursor-pointer"}>
      X
    </button>
  );
}
