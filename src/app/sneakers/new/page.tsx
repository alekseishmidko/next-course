"use client";

import { createSneakerDrop } from "@/actions/sneakers";
import { useAction } from "next-safe-action/hooks";

/**
 * Клиентская страница для тестирования server action `createSneakerDrop`.
 *
 * Почему это client component:
 * - `useAction` является React hook и работает только в браузерной части приложения;
 * - кнопка вызывает `execute(mockSneaker)`, после чего `next-safe-action` отправляет запрос к
 *   server action;
 * - UI может читать `isPending`, `result.serverError`, `result.validationErrors` и успешный
 *   `result.data`.
 *
 * @example
 * // Нажатие на кнопку вызывает:
 * execute({ title: "Aztrack", price: 123, stock: 12 });
 *
 * // Возможные состояния:
 * // isPending === true             -> запрос выполняется
 * // result.validationErrors        -> данные не прошли Zod-схему
 * // result.serverError             -> action упал на сервере
 * // result.data.success === true   -> товар создан
 */
export default function NewDropPage() {
  const { result, isPending, execute } = useAction(createSneakerDrop);
  const mockSneaker = { title: "Aztrack", price: 123, stock: 12 };
  const handleTriggerDrop = async () => {
    execute(mockSneaker);
  };

  return (
    <main className="p-5">
      <h2>Тестирование Server Action</h2>

      <p>
        Товар для отправки: {mockSneaker.title} (${mockSneaker.price})
      </p>

      <button disabled={isPending} onClick={handleTriggerDrop}>
        {isPending ? "отправка на сервер" : "Отправить данные на сервер"}
      </button>

      <div className="p-5 bg-amber-200">
        {result?.serverError && (
          <p className="text-4xl text-red-800">{`ошибка бекенда : ${JSON.stringify(result.serverError)}`}</p>
        )}
      </div>
      <div className="p-5">
        {result?.validationErrors && (
          <p className="text-4xl text-red-800">{`ошибка валидации : ${JSON.stringify(result.validationErrors)}`}</p>
        )}
      </div>

      <div className="p-5 bg-blue-300 mt-4 text-red-900 text-6xl">
        {result?.data?.success && <p>{JSON.stringify(result?.data?.data)}</p>}
      </div>
    </main>
  );
}
