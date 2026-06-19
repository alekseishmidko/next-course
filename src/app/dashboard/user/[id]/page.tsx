/**
 * Описывает параметры динамического маршрута `/dashboard/user/[id]`.
 *
 * @property params Promise с объектом параметров, где `id` берется из URL.
 */
interface UserPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Страница пользователя внутри dashboard.
 *
 * Получает динамический параметр `id` из маршрута и выводит его на странице.
 */
export default async function UserPage(props: UserPageProps) {
  const { params } = props;
  const { id } = await params;

  return <div className="text-2xl text-amber-950">{id}</div>;
}
