"use client";
import { startTransition, useOptimistic, useState } from "react";
import { toggleFavouriteAction } from "@/actions/sneakers";

/**
 * Модель кроссовка для локального каталога.
 *
 * `isFavorite` хранит текущее состояние избранного и используется как базовое состояние для
 * optimistic UI.
 */
type Sneaker = {
  id: number;
  title: string;
  isFavorite: boolean;
};

/**
 * Страница каталога кроссовок с optimistic обновлением избранного.
 *
 * Пользователь видит изменение сразу после клика, не дожидаясь ответа server action. Если сервер
 * подтверждает операцию, базовое состояние `sneakers` обновляется. Если сервер возвращает ошибку,
 * optimistic состояние откатывается к последнему подтвержденному `sneakers`, а UI показывает
 * сообщение об ошибке.
 */
export default function SneakersPage() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([
    { id: 1, title: "Nike Air Max 90", isFavorite: false },
    {
      id: 2,
      title: "Adidas Yeezy Boost",
      isFavorite: false,
    },
    { id: 3, title: "Puma RS-X", isFavorite: true },
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Optimistic слой поверх подтвержденного состояния `sneakers`.
   *
   * Второй аргумент `useOptimistic` - reducer. Он обязан вернуть новое состояние. Важно не просто
   * вызвать `state.map(...)`, а вернуть результат `map`, иначе React не получит optimistic update.
   *
   * @example
   * // Было:
   * [{ id: 1, isFavorite: false }]
   *
   * // setOptimisticSneakers(1)
   * // UI сразу видит:
   * [{ id: 1, isFavorite: true }]
   */
  const [optimisticSneakers, setOptimisticSneakers] = useOptimistic<Sneaker[], number>(
    sneakers,
    (state, targetId) =>
      state.map((item) =>
        item.id === targetId ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
  );

  /**
   * Переключает состояние избранного для выбранного кроссовка.
   *
   * `startTransition` помечает optimistic update как неблокирующее обновление UI:
   * 1. Сбрасываем прошлую ошибку.
   * 2. Сразу вызываем `setOptimisticSneakers(id)`, чтобы кнопка изменилась мгновенно.
   * 3. Ждем `toggleFavouriteAction`.
   * 4. При ошибке показываем сообщение, а optimistic слой откатывается к базовому `sneakers`.
   * 5. При успехе обновляем базовое состояние `setSneakers`, закрепляя результат.
   */
  const handleToggleFavourite = (id: number) => {
    setErrorMessage(null);
    startTransition(async () => {
      setOptimisticSneakers(id);

      const result = await toggleFavouriteAction({ id });
      if (result.serverError) {
        setErrorMessage(result.serverError);
        return;
      }

      if (result.data?.success) {
        setSneakers((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
        );
      }
    });
  };
  return (
    <main className="p-5 font-sans max-w-md text-black">
      <h2 className="text-xl font-semibold mb-4">Каталог кроссовок</h2>

      {errorMessage && (
        <div className="text-red-600 p-2.5 border border-red-600 mb-4 rounded bg-red-50">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {optimisticSneakers?.map((sneaker) => (
          <div
            key={sneaker.id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-white"
          >
            <span>{sneaker.title}</span>

            <button
              onClick={() => handleToggleFavourite(sneaker.id)}
              className="text-2xl bg-none border-none cursor-pointer outline-none"
            >
              {sneaker.isFavorite ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
