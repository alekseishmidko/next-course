/**
 * Тестовая страница ошибки по маршруту `/dashboard/error`.
 *
 * Сейчас намеренно выбрасывает ошибку, чтобы показать работу локального `error.tsx` внутри
 * сегмента `/dashboard`.
 */
export default function DashboardErrorPage() {
  throw new Error("Error");
  return (
    <div className="p-4 bg-zinc-50 border-2 border-zinc-500 rounded-md">
      <h1 className="text-xl font-bold text-black">Настройки профиля</h1>

      <p className="mt-2 text-zinc-600">Эта страница находится по пути /dashboard/settings</p>
    </div>
  );
}
