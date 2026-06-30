import { db } from "@/shared/lib/db/db";
import { products } from "@/db/schema";

/**
 * Заставляет страницу списка продуктов рендериться во время запроса, а не во время `next build`.
 *
 * Страница читает PostgreSQL через Drizzle, поэтому Docker image не должен пытаться подключаться к
 * базе на этапе сборки. При `force-dynamic` запрос к БД выполняется уже в запущенном контейнере,
 * где доступен runtime `DATABASE_URL`.
 *
 * @example
 * // next build:
 * // страница компилируется, но SQL-запрос не выполняется.
 *
 * // GET /products в runtime:
 * // выполняется db.select().from(products).
 */
export const dynamic = "force-dynamic";

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
