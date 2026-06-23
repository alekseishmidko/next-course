import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

interface ProductListItem {
  id: number;
  title: string;
  price: number;
}

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

  return data.products as ProductListItem[];
}

/**
 * Разрешает Next.js обрабатывать динамические параметры, которые не были сгенерированы заранее.
 *
 * В динамическом сегменте `[id]` это означает: если `generateStaticParams()` вернул товары с
 * `id: "1"` и `id: "2"`, а пользователь открыл `/products/31`, Next может сгенерировать страницу
 * по запросу вместо 404.
 *
 * @example
 * export const dynamicParams = true;
 * // /products/31 будет обработан on demand, даже если его не было в generateStaticParams().
 */
export const dynamicParams = true;

/**
 * Генерирует список параметров для предварительной генерации страниц (SSG).
 *
 * Функция вызывается Next.js во время сборки приложения.
 * На основании возвращаемых параметров будут созданы статические страницы:
 *
 * Важно: эта функция обычно живет в файле динамического маршрута вроде
 * `app/products/[id]/page.tsx`, потому что возвращает params для сегмента `[id]`.
 *
 * @example
 * // Возвращаемое значение:
 * [
 *   { id: "1" },
 *   { id: "2" },
 *   { id: "3" }
 * ]
 *
 * // Next использует эти params для предварительной генерации:
 * // /products/1
 * // /products/2
 * // /products/3
 *
 * Это аналог `getStaticPaths` из Pages Router.
 *
 * @returns Массив параметров маршрута для генерации статических страниц.
 */
export async function generateStaticParams() {
  /**
   * Получаем список товаров из внешнего API.
   */
  const res = await fetch("https://dummyjson.com/products");

  /**
   * Преобразуем HTTP-ответ в JavaScript-объект.
   */
  const data = await res.json();

  /**
   * Преобразуем каждый товар в объект параметров маршрута.
   *
   * Next.js ожидает формат:
   * [
   *   { id: '1' },
   *   { id: '2' },
   *   { id: '3' }
   * ]
   *
   * где id соответствует сегменту маршрута [id].
   */

  return data.products.map((product: ProductListItem) => ({
    id: product.id.toString(),
  }));
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
