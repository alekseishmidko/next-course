import { ErrorTrigger } from "@/app/dashboard/error/components/error-trigger";

/**
 * Тестовая страница ошибки по маршруту `/dashboard/error`.
 *
 * Не выбрасывает ошибку во время серверного рендера, чтобы production build мог успешно
 * prerender-ить страницу. Для проверки локального `error.tsx` используется клиентская кнопка.
 */
export default function DashboardErrorPage() {
  return (
    <div className="p-4 bg-red-50 border-2 border-red-500 rounded-md">
      <h1 className="text-xl font-bold text-black">Проверка error boundary</h1>

      <p className="mt-2 text-zinc-600">
        Эта страница находится по пути /dashboard/error. Нажмите кнопку, чтобы вызвать ошибку на
        клиенте и проверить локальный обработчик `dashboard/error.tsx`.
      </p>

      <ErrorTrigger />
    </div>
  );
}
