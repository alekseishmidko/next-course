import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/db/schema";

/**
 * Получаем строку подключения к базе данных из переменных окружения.
 *
 * `DATABASE_URL` не хранится в коде, потому что содержит параметры подключения и пароль. Значение
 * должно приходить из `.env` локально или из переменных окружения на сервере.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env file");
}

/**
 * Используется в режиме разработки для хранения единственного экземпляра
 * подключения к базе данных между Hot Reload'ами.
 *
 * Без этого при каждом Fast Refresh создавался бы новый postgres client. В dev-режиме это быстро
 * приводит к лишним соединениям с базой.
 */
const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

/**
 * Создаем клиент PostgreSQL.
 *
 * В production создается одно подключение.
 * В development подключение кешируется в globalThis,
 * чтобы избежать создания новых соединений после Hot Reload.
 *
 * @example
 * // development:
 * // первый импорт файла создает client;
 * // последующие Fast Refresh переиспользуют globalForDb.client.
 *
 * @example
 * // production:
 * // client создается из connectionString без записи в globalThis.
 */
export const client =
  globalForDb.client ??
  postgres(connectionString, {
    /**
     * Максимальное количество соединений в пуле.
     */
    max: process.env.NODE_ENV === "production" ? 10 : 1,

    /**
     * Время простоя соединения перед его закрытием (сек.).
     */
    idle_timeout: 30,

    /**
     * Максимальное время ожидания подключения (мс).
     */
    connect_timeout: 5000,
  });

/**
 * Сохраняем экземпляр клиента только в режиме разработки.
 *
 * В production глобальное кеширование клиента не нужно: процесс приложения живет предсказуемее, а
 * lifecycle соединений контролируется настройками пула и инфраструктурой.
 */
if (process.env.NODE_ENV === "development") {
  globalForDb.client = client;
}

/**
 * Экземпляр Drizzle ORM для работы с базой данных.
 *
 * `schema` передается в Drizzle, чтобы были доступны типизированные relational queries и таблицы из
 * `src/db/schema.ts`.
 */
export const db = drizzle(client, {
  schema,
});
