import Link from "next/link";

/**
 * Глобальная 404-страница приложения.
 *
 * Используется Next.js для неизвестных маршрутов и при вызове `notFound()`. Показывает сообщение
 * об ошибке и ссылки для возврата на главную страницу или в dashboard.
 */
export default function NotFound() {
  return (
    <main className="min-h-dvh bg-zinc-50 px-6 py-16 text-zinc-950">
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">404</p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Страница не найдена</h1>

        <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
          Такой страницы нет или адрес был изменен. Вернитесь на главную страницу или откройте
          dashboard.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            На главную
          </Link>

          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
