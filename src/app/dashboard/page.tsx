/**
 * Главная страница раздела `/dashboard`.
 *
 * Искусственно задерживает ответ на 3 секунды, чтобы показать работу `loading.tsx`, а затем
 * выводит основной контент дашборда.
 */
export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-md">
      <h1 className="text-xl font-bold text-black">Контент страницы Dashboard</h1>
    </div>
  );
}
