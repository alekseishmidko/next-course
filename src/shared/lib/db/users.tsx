import "server-only";

/**
 * Mock-данные пользователей для демонстрации server-side загрузки.
 *
 * Файл помечен `server-only`, поэтому его нельзя импортировать в клиентские компоненты.
 */
const MOCK_USERS = [
  { id: 1, name: "Артем", email: "artem@gmail.com" },
  { id: 2, name: "Арина", email: "arina@gmail.gmail" },
  { id: 3, name: "Никита", email: "nikita@gmail.com" },
  { id: 4, name: "Дмитрий", email: "dima@gmail.com" },
];

/**
 * Упрощенная имитация database API.
 *
 * Метод `findMany` возвращает список пользователей с искусственной задержкой, чтобы страница
 * работала как пример асинхронной серверной загрузки данных.
 */
export const db = {
  query: {
    users: {
      findMany: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        return MOCK_USERS;
      },
    },
  },
};
