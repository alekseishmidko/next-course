import { db } from "@/shared/lib/db/users";
import { WinkButton } from "@/app/dashboard/user/components/wink-button";

/**
 * Страница списка пользователей в dashboard.
 *
 * Загружает пользователей на сервере через server-only mock database, показывает счетчик записей
 * и рендерит каждого пользователя карточкой с аватаром-инициалом, email, id и клиентской кнопкой
 * действия.
 */
export default async function UserPage() {
  const users = await db.query.users.findMany();

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-zinc-950">
      <div className="flex flex-col gap-2 border-b border-emerald-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Dashboard users
          </p>
          <h1 className="mt-2 text-2xl font-bold">Пользователи</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Список пользователей, полученный из server-only mock database.
          </p>
        </div>

        <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
          Всего: {users.length}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {users.map((user) => (
          <article
            key={user.id}
            className="flex items-center gap-4 rounded-lg border border-emerald-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {user.name.slice(0, 1)}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-zinc-950">{user.name}</h2>
              <p className="truncate text-sm text-zinc-500">{user.email}</p>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              ID {user.id}
            </span>

            <WinkButton name={user.name} />
          </article>
        ))}
      </div>
    </section>
  );
}
