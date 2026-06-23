import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Загружает один товар по `id` и кеширует результат по аргументу функции.
 *
 * `"use cache"` включает кеширование именно этой функции. Так как `id` является аргументом,
 * разные товары получают разные ключи кеша:
 *
 * @example
 * await fetchProduct("1") // отдельная cache entry для товара 1
 * await fetchProduct("2") // отдельная cache entry для товара 2
 *
 * `cacheLife("days")` использует preset-профиль Next.js для данных, которые можно держать
 * относительно долго. Это подходит для детальной страницы товара, если ее описание и цена не
 * меняются каждую секунду.
 *
 * Если API отвечает ошибкой, вызывается `notFound()`, и Next показывает 404 вместо страницы товара.
 */
async function fetchProduct(id: string) {
  "use cache";

  cacheLife("days");

  const res = await fetch(`https://dummyjson.com/products/${id}`);

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return data;
}

/**
 * Детальная страница товара `/products/[id]`.
 *
 * Достает динамический `id` из params, получает кешированный товар через `fetchProduct(id)` и
 * рендерит карточку товара.
 */
export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await fetchProduct(id);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-white mt-2">{product.title}</h1>

      <p className="text-gray-400 mt-4">{product.description}</p>

      <div className="text-2xl font-mono text-white mt-6">${product.price}</div>
    </div>
  );
}
