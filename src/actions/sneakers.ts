"use server";

import { z } from "zod";
import { actionClient } from "@/shared/lib/safe-action";
import { db } from "@/shared/lib/db/db";
import { products } from "@/db/schema";

/**
 * Схема входных данных для создания sneaker drop.
 *
 * Zod валидирует payload до выполнения server action:
 * - `title` должен быть строкой от 3 до 50 символов;
 * - `price` должен быть положительным числом;
 * - `stock` должен быть целым неотрицательным числом.
 *
 * Если клиент передаст невалидные данные, `next-safe-action` вернет `validationErrors`, а тело
 * action не выполнится. Это защищает серверный код от ручных/битых запросов с клиента.
 *
 * @example
 * // Валидный payload:
 * { title: "Aztrack", price: 123, stock: 12 }
 *
 * @example
 * // Невалидный payload: title слишком короткий, price отрицательный.
 * { title: "A", price: -10, stock: 2 }
 */
const createSneakerSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Название должно быть не короче 3 символов",
    })
    .max(50, {
      message: "Название слишком длинное",
    }),

  price: z.number().positive({
    message: "Цена должна быть больше нуля",
  }),

  stock: z
    .number()
    .int({
      message: "Количество должно быть целым числом",
    })
    .nonnegative({
      message: "Количество не может быть отрицательным",
    }),
});

/**
 * Server action для создания нового товара в категории `mens-shoes`.
 *
 * Action объявлен в файле с директивой `"use server"`, поэтому выполняется только на сервере.
 * Клиент отправляет форму через `useActionState`, но запись в PostgreSQL выполняется в серверной
 * среде через Drizzle ORM.
 *
 * Поток выполнения:
 * 1. `inputSchema(createSneakerSchema)` валидирует входные данные.
 * 2. Если данные валидны, action вставляет товар в таблицу `products`.
 * 3. Цена переводится в целое число через `Math.round(price * 100)`, чтобы хранить деньги в
 *    минимальных единицах и избегать проблем с floating point.
 * 4. При успешной вставке возвращается `{ success: true, productId }`.
 * 5. При ошибке возвращается `{ success: false, error }`, чтобы UI мог показать сообщение.
 *
 * @example
 * // Данные формы:
 * { title: "Aztrack", price: 123.45, stock: 12 }
 *
 * // Запись в БД:
 * { name: "Aztrack", price: 12345, stock: 12 }
 */
export const createSneakerDrop = actionClient
  .inputSchema(createSneakerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const [newProduct] = await db
        .insert(products)
        .values({
          name: parsedInput.title,
          price: Math.round(parsedInput.price * 100),
          stock: parsedInput.stock,
        })
        .returning();

      return {
        success: true,
        productId: newProduct.id,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
    }
  });

/**
 * Схема входных данных для переключения избранного.
 *
 * Action принимает только положительный числовой `id`, поэтому клиент не может отправить пустой,
 * строковый или отрицательный идентификатор без ошибки валидации.
 */
const toggleFavSchema = z.object({
  id: z.number().positive(),
});

/**
 * Server action, которая имитирует сохранение состояния избранного.
 *
 * Сейчас action специально ждет 400 мс, чтобы было видно разницу между обычным ожиданием сервера и
 * optimistic UI. Клиентская страница меняет состояние сразу через `useOptimistic`, а этот action
 * только подтверждает или отклоняет операцию.
 *
 * Для `id === 2` намеренно выбрасывается ошибка, чтобы проверить сценарий отката optimistic
 * состояния и отображение `serverError` на клиенте.
 *
 * @example
 * const result = await toggleFavouriteAction({ id: 1 });
 * // result.data?.success === true
 *
 * @example
 * const result = await toggleFavouriteAction({ id: 2 });
 * // result.serverError содержит сообщение об ошибке
 */
export const toggleFavouriteAction = actionClient
  .inputSchema(toggleFavSchema)
  .action(async ({ parsedInput }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (parsedInput.id === 2) {
      throw new Error("Не удалось обновить ");
    }

    return { success: true, productId: parsedInput.id };
  });
