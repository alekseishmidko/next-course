"use server";

import { revalidateTag, updateTag } from "next/cache";

/**
 * Инвалидирует кеш после покупки конкретного товара.
 *
 * `revalidateTag` помечает кеш по тегу как требующий обновления. В этом примере сбрасываются:
 * - `sneaker-${id}` - карточка конкретного товара;
 * - `sneakers-data` - общий каталог обуви, где мог измениться остаток.
 *
 * @example
 * await handlePurchase("12");
 * // Следующий рендер товара 12 и каталога обуви получит актуальные данные.
 */
export async function handlePurchase(id: string): Promise<void> {
  revalidateTag(`sneaker-${id}`, { expire: 0 });
  revalidateTag(`sneakers-data`, { expire: 0 });
}

/**
 * Обновляет кеш списка товаров, связанный с тегом `all_products`.
 *
 * `revalidateTag("all_products")` подходит, когда допустимо отдать старые данные и обновить кеш.
 * `updateTag("all_products")` используется для сценария "read your own writes": после изменения
 * данных следующий запрос должен увидеть свежий результат без ожидания фоновой ревалидации.
 *
 * @example
 * await updateProductInfo();
 * // После server action страница /products должна получить обновленный список товаров.
 */
export async function updateProductInfo(): Promise<void> {
  revalidateTag("all_products", {});
  updateTag("all_products");
}
