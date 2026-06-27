import { db } from "@/shared/lib/db/db";
import { products } from "@/db/schema";

/**
 * Включает ISR для страницы списка продуктов.
 *
 * Next.js будет считать HTML/RSC payload страницы свежим 60 секунд. После этого следующий запрос
 * может инициировать фоновую регенерацию страницы с актуальными данными из PostgreSQL.
 *
 * @example
 * // 0-60 секунд после рендера:
 * // пользователь получает закешированный результат.
 *
 * // После 60 секунд:
 * // следующий запрос может получить старую версию, пока Next обновляет кеш в фоне.
 */
export const revalidate = 60;

/**
 * Страница списка продуктов из PostgreSQL.
 *
 * Выполняет server-side запрос через Drizzle:
 * `db.select().from(products).orderBy(products.createdAt)`.
 *
 * В отличие от прежнего примера с внешним API, данные теперь читаются из локальной таблицы
 * `products`, которую создает Drizzle migration. Страница остается server component, поэтому
 * подключение к базе и SQL-запрос не попадают в клиентский bundle.
 */
export default async function ProductsListPage() {
  const items = await db.select().from(products).orderBy(products.createdAt);

  return (
    <div>
      {items.map((item) => {
        return (
          <div key={item.id}>
            {item.name} {item.price} {item.stock}
          </div>
        );
      })}
    </div>
  );
}
