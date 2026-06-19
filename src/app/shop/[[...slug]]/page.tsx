/**
 * Описывает параметры optional catch-all маршрута `/shop/[[...slug]]`.
 *
 * @property params Promise с параметрами маршрута. `slug` отсутствует на `/shop` и содержит массив
 * сегментов на вложенных маршрутах вроде `/shop/catalog/brand/model`.
 */
interface ShopPageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Страница магазина для optional catch-all маршрута.
 *
 * Обрабатывает как корневой адрес `/shop`, так и произвольную глубину вложенности после `/shop`.
 * Для примера первые три сегмента URL показываются как `catalog`, `brand` и `model`.
 */
export default async function ShopPage(props: ShopPageProps) {
  const { params } = props;
  const { slug } = await params;
  const currentSlug = slug ?? [];
  const [catalog, brand, model] = currentSlug;
  const isShopRoot = currentSlug.length === 0;

  return (
    <main className="min-h-dvh bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">Shop route</p>

        <h1 className="mt-3 text-3xl font-bold">
          {isShopRoot ? "Каталог магазина" : "Страница товара"}
        </h1>

        <p className="mt-3 text-zinc-600">
          Это пример контента для optional catch-all маршрута{" "}
          <span className="font-mono text-zinc-900">/shop/[[...slug]]</span>. Он работает и для{" "}
          <span className="font-mono text-zinc-900">/shop</span>, и для вложенных адресов вроде{" "}
          <span className="font-mono text-zinc-900">/shop/catalog/brand/model</span>.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase text-amber-700">Catalog</p>
            <p className="mt-1 font-mono text-sm">{catalog ?? "не указан"}</p>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase text-blue-700">Brand</p>
            <p className="mt-1 font-mono text-sm">{brand ?? "не указан"}</p>
          </div>

          <div className="rounded-md bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-700">Model</p>
            <p className="mt-1 font-mono text-sm">{model ?? "не указан"}</p>
          </div>
        </div>

        <pre className="mt-6 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm text-zinc-50">
          {JSON.stringify({ slug: currentSlug, catalog, brand, model }, null, 2)}
        </pre>
      </div>
    </main>
  );
}
