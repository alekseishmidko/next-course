"use server";

import { z } from "zod";
import { actionClient } from "@/shared/lib/safe-action";

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
 * Клиент вызывает его через `useAction(createSneakerDrop)`, но реальный `fetch` к dummyjson и
 * обработка ошибок происходят в серверной среде.
 *
 * Поток выполнения:
 * 1. `inputSchema(createSneakerSchema)` валидирует входные данные.
 * 2. Если данные валидны, action отправляет POST-запрос во внешний API.
 * 3. При успешном ответе возвращается `{ success: true, data }`.
 * 4. При ошибке возвращается `{ success: false, error }`, чтобы UI мог показать сообщение.
 *
 * @example
 * // Клиентский компонент:
 * const { execute } = useAction(createSneakerDrop);
 * execute({ title: "Aztrack", price: 123, stock: 12 });
 */
export const createSneakerDrop = actionClient
  .inputSchema(createSneakerSchema)
  .action(async ({ clientInput: payload }) => {
    console.log("Payload: ", payload);

    try {
      /**
       * Отправляем данные на сервер.
       */
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          category: "mens-shoes",
        }),
      });

      /**
       * Проверяем успешность ответа.
       */
      if (!res.ok) {
        throw new Error("Не удалось создать товар");
      }

      /**
       * Получаем созданный объект товара.
       */
      const data = await res.json();

      return {
        success: true,
        productId: data.id,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
    }
  });
