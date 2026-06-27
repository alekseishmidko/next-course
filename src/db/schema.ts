import { integer, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Таблица товаров магазина.
 *
 * Хранит базовые данные, которые нужны для каталога и складского учета:
 * - `id` генерируется PostgreSQL через `gen_random_uuid()`;
 * - `name`, `price`, `stock` обязательны;
 * - `createdAt` автоматически получает текущее время создания записи;
 * - `brandId` связывает товар с брендом, но остается nullable, чтобы товар можно было создать без
 *   привязки к бренду.
 *
 * Связи этой таблицы описаны отдельно в `productsRelations`.
 */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  price: integer("price").notNull(),

  stock: integer("stock").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  brandId: uuid("brand_id").references(() => brands.id),
});

/**
 * Relations для таблицы `products`.
 *
 * Drizzle использует эти связи не для создания колонок, а для типизированных relational queries:
 * `db.query.products.findMany({ with: { brand: true, details: true, categories: true } })`.
 *
 * Модель связей:
 * - один товар принадлежит одному бренду (`brand`);
 * - один товар имеет одну запись с расширенными деталями (`details`);
 * - один товар может быть связан с несколькими категориями через join table
 *   `productsToCategories`.
 */
export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  details: one(productDetails),
  categories: many(productsToCategories),
}));

/**
 * Таблица брендов.
 *
 * Бренд является отдельной сущностью, чтобы несколько товаров могли ссылаться на один и тот же
 * бренд через `products.brandId`. Это нормализует данные и убирает дублирование названия бренда в
 * каждой строке товара.
 */
export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Relations для таблицы `brands`.
 *
 * Описывает обратную связь: один бренд может иметь много товаров. Это позволяет запрашивать бренд
 * вместе с его товарами через relational query.
 */
export const brandRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

/**
 * Таблица расширенных характеристик товара.
 *
 * Вынесена отдельно от `products`, потому что описание и материалы являются дополнительными
 * данными и могут быть нужны не во всех списочных запросах. Поле `productId` уникально, поэтому
 * связь с товаром получается one-to-one: у одного товара может быть только одна запись details.
 */
export const productDetails = pgTable("product_details", {
  id: uuid("id").defaultRandom().primaryKey(),

  description: varchar("description", {
    length: 2000,
  }),

  materials: varchar("materials", {
    length: 500,
  }),

  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id),
});

/**
 * Relations для таблицы `product_details`.
 *
 * Каждая запись details принадлежит одному товару. `fields` указывает локальный foreign key,
 * `references` указывает целевую primary key колонку.
 */
export const productDetailsRelations = relations(productDetails, ({ one }) => ({
  product: one(products, {
    fields: [productDetails.productId],
    references: [products.id],
  }),
}));

/**
 * Таблица категорий товаров.
 *
 * Категории вынесены в отдельную таблицу, потому что один товар может находиться в нескольких
 * категориях, а одна категория может содержать много товаров. Такая many-to-many связь реализуется
 * через `productsToCategories`.
 */
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 100,
  }).notNull(),
});

/**
 * Join table для many-to-many связи между товарами и категориями.
 *
 * В таблице нет отдельного surrogate `id`: первичным ключом является пара
 * `(productId, categoryId)`. Это запрещает дублировать одну и ту же связь товара с категорией.
 *
 * @example
 * // Один товар в двух категориях:
 * { productId: "product-1", categoryId: "running" }
 * { productId: "product-1", categoryId: "sale" }
 *
 * // Повторная вставка { productId: "product-1", categoryId: "running" } нарушит primary key.
 */
export const productsToCategories = pgTable(
  "products_to_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.productId, t.categoryId],
    }),
  }),
);

/**
 * Relations для join table `products_to_categories`.
 *
 * Каждая строка join table указывает на один товар и одну категорию. Эти связи нужны Drizzle, чтобы
 * удобно раскрывать many-to-many структуру в запросах.
 */
export const productsToCategoriesRelations = relations(productsToCategories, ({ one }) => ({
  product: one(products, {
    fields: [productsToCategories.productId],
    references: [products.id],
  }),

  category: one(categories, {
    fields: [productsToCategories.categoryId],
    references: [categories.id],
  }),
}));

/**
 * Relations для таблицы `categories`.
 *
 * Описывает обратную сторону many-to-many: категория содержит много строк в join table, а через
 * них связана с множеством товаров.
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productsToCategories),
}));
