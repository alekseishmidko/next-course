import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

/**
 * Загружает список популярных товаров и кеширует результат через Cache Components.
 *
 * Важные детали кеширования:
 * - `"use cache"` делает результат функции кешируемым. Ключ кеша строится из build id,
 *   идентификатора функции и ее аргументов. У этой функции аргументов нет, поэтому все вызовы
 *   `fetchProducts()` читают один и тот же кешированный список.
 * - `cacheLife({ stale: 60, revalidate: 120, expire: 3600 })` задает inline-профиль:
 *   `stale: 60` - клиентский router может считать данные свежими 60 секунд;
 *   `revalidate: 120` - Next может обновлять кеш примерно раз в 120 секунд;
 *   `expire: 3600` - через час кеш считается истекшим и должен быть получен заново.
 * - `cacheTag("all_products")` помечает запись тегом, чтобы server action могла инвалидировать
 *   именно список товаров, не трогая другие кеши.
 *
 * @example
 * // Первый заход на /products делает запрос к dummyjson и сохраняет результат.
 * // Повторный заход вскоре после этого получает список из кеша.
 * // Вызов revalidateTag("all_products") помечает этот список для обновления.
 */
async function fetchProducts() {
  "use cache";

  cacheLife({ stale: 60, revalidate: 120, expire: 3600 });
  cacheTag("all_products");
  const res = await fetch("https://dummyjson.com/products?limit=5");

  const data = await res.json();

  return data.products;
}

/**
 * Страница списка товаров.
 *
 * Получает данные через `fetchProducts()`, поэтому сама страница демонстрирует повторное
 * использование кешированного server-side результата между запросами.
 */
export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="p-6 bg-gray-900 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-white">Популярные товары</h2>

      <ul className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-expect-error*/}
        {products.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between"
          >
            <span className="text-gray-300">{product.title}</span>

            <span className="text-emerald-400 font-mono">${product.price}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
