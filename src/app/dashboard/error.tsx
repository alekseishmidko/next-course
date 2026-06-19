"use client";

/**
 * Описывает свойства error boundary для сегмента `/dashboard`.
 *
 * @property error Ошибка, возникшая при рендеринге дочернего маршрута.
 * @property reset Функция повторной попытки рендера проблемного сегмента.
 */
interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Клиентский обработчик ошибок для маршрутов внутри `/dashboard`.
 *
 * Показывает сообщение ошибки и кнопку повторной попытки, которая вызывает `reset`.
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="p-4 border-2 border-red-500 bg-red-50 rounded-lg text-red-700">
      <h2 className="font-bold text-lg">В Дашборде произошел сбой</h2>

      <p className="text-sm my-2 font-mono">{error.message}</p>
      <button onClick={reset} className="px-3 py-2 bg-red-600 text-white rounded">
        Попробовать снова
      </button>
    </div>
  );
}
