interface SneakerCatalogItem {
  id: number;
  title: string;
  stock: number;
}

/**
 * Загружает каталог мужской обуви и помечает fetch тегом `sneakers-data`.
 *
 * `next.tags` привязывает результат fetch к тегу. Позже server action может вызвать
 * `revalidateTag("sneakers-data")`, и Next обновит все кешированные данные, связанные с этим
 * тегом.
 *
 * @example
 * // getSpecsCatalog() и getSingleSneaker(id) используют общий тег "sneakers-data".
 * // После покупки можно вызвать revalidateTag("sneakers-data"),
 * // чтобы обновить и общий каталог, и отдельные карточки товаров.
 */
async function getSpecsCatalog() {
  const res = await fetch("https://dummyjson.com/products/category/mens-shoes", {
    next: {
      tags: ["sneakers-data"],
    },
  });

  if (!res.ok) {
    throw new Error("Ошибка сети");
  }

  const data = await res.json();

  return data.products as SneakerCatalogItem[];
}

/**
 * Server component каталога обуви.
 *
 * Рендерит список товаров из кешируемого fetch-запроса. Если тег `sneakers-data` будет
 * инвалидирован, следующий рендер получит более свежие данные.
 */
export async function SneakerCatalog() {
  const products = await getSpecsCatalog();

  return (
    <section>
      <h2>Доступный каталог обуви</h2>

      <ul>
        {products.map((item) => (
          <li key={item.id}>
            {item.title} - <strong>Осталось: {item.stock} шт.</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
