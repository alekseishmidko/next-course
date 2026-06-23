import { createSafeActionClient } from "next-safe-action";

/**
 * Общий клиент `next-safe-action` для server actions проекта.
 *
 * `createSafeActionClient` задает единое поведение для всех actions:
 * - как валидировать входные данные;
 * - как сериализовать результат;
 * - как обрабатывать ошибки сервера.
 *
 * `handleServerError` не отдает клиенту весь объект ошибки и stack trace. Вместо этого он логирует
 * ошибку на сервере и возвращает безопасную строку, которую можно показать в UI.
 *
 * @example
 * export const myAction = actionClient
 *   .inputSchema(schema)
 *   .action(async ({ clientInput }) => {
 *     return { ok: true, data: clientInput };
 *   });
 */
export const actionClient = createSafeActionClient({
  handleServerError: (err: Error) => {
    console.log("[Safe Action Client] Error: ", err);

    return err?.message ?? "Unknown error";
  },
});
