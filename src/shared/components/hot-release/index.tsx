/**
 * Загружает один товар дня и помечает результат двумя тегами кеша.
 *
 * Теги дают разную гранулярность инвалидации:
 * - `sneakers-data` общий для всего обувного каталога;
 * - `sneaker-${id}` точечный тег только для конкретного товара.
 *
 * @example
 * // Если изменился только товар 12:
 * // revalidateTag("sneaker-12")
 *
 * // Если изменилась вся категория обуви:
 * // revalidateTag("sneakers-data")
 */
async function getSingleSneaker(id: string) {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: {
      tags: ["sneakers-data", `sneaker-${id}`],
    },
  });

  if (!res.ok) {
    throw new Error("Товар не найден");
  }

  return res.json();
}

/**
 * Server component с товаром дня.
 *
 * Получает `id`, загружает один товар и показывает цену/остаток. Кеш этого компонента можно
 * обновлять как точечно по `sneaker-${id}`, так и массово через `sneakers-data`.
 */
export async function HotRelease({ id }: { id: string }) {
  const item = await getSingleSneaker(id);

  return (
    <section
      style={{
        border: "1px solid #000",
        padding: "15px",
      }}
    >
      <h3>Товар дня</h3>

      <p>Модель: {item.title}</p>

      <p>Цена: ${item.price}</p>

      <p>Актуальный остаток: {item.stock} шт.</p>
    </section>
  );
}
