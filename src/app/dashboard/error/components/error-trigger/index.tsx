"use client";

/**
 * Клиентская кнопка для проверки `dashboard/error.tsx`.
 *
 * Ошибка выбрасывается только после клика в браузере, поэтому production build и prerender страницы
 * `/dashboard/error` не падают.
 */
export function ErrorTrigger() {
  return (
    <button
      onClick={() => {
        throw new Error("Test dashboard error");
      }}
      className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
    >
      Сломать страницу
    </button>
  );
}
