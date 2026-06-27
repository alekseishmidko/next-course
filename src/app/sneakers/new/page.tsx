"use client";

import { createSneakerDrop } from "@/actions/sneakers";
import { useActionState } from "react";
import { FormButtonComponent } from "@/app/sneakers/new/components/form-button";

/**
 * Состояние формы создания sneaker drop.
 *
 * `useActionState` хранит этот объект между отправками формы и передает его в UI:
 * - `success` показывает, что сервер успешно создал товар;
 * - `productId` хранит id созданного товара;
 * - `error` содержит общую серверную ошибку;
 * - `validationErrors` содержит ошибки конкретных полей после проверки Zod-схемой на сервере.
 */
type FormState = {
  success: boolean;
  productId: string | null;
  error: string | null;
  validationErrors: {
    title?: string[];
    price?: string[];
    stock?: string[];
  };
};

/**
 * Начальное состояние формы до первой отправки.
 *
 * Все флаги сброшены, id товара отсутствует, а объект ошибок пустой. Это состояние используется
 * вторым аргументом `useActionState`.
 */
const initialState: FormState = {
  success: false,
  productId: null,
  error: null,
  validationErrors: {},
};

/**
 * Страница создания sneaker drop через форму и server action.
 *
 * Компонент клиентский, потому что использует `useActionState` для управления состоянием формы.
 * Сама бизнес-логика создания товара остается на сервере в `createSneakerDrop`.
 *
 * Важная часть типизации:
 * `useActionState<FormState, FormData>` указывает два типа:
 * - `FormState` - что возвращает action и что хранится в `state`;
 * - `FormData` - payload, который React передает вторым аргументом при submit формы.
 *
 * Без второго generic TypeScript выбирает overload, где action принимает только `state`, и функция
 * `(prevState, formData)` начинает конфликтовать с сигнатурой React.
 *
 * @example
 * const [state, formAction, isPending] = useActionState<FormState, FormData>(
 *   async (prevState, formData) => nextState,
 *   initialState,
 * );
 */
export default function NewDropPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    /**
     * Form action, которую React вызывает при отправке формы.
     *
     * `formData` приходит из `<form action={formAction}>`, поэтому значения извлекаются по `name`
     * каждого input. Затем данные передаются в `createSneakerDrop`, где проходят Zod-валидацию и
     * отправляются на сервер.
     */
    async (prevState: FormState, formData: FormData) => {
      const rawTitle = String(formData.get("title"));
      const rawPrice = Number(formData.get("price"));
      const rawStock = Number(formData.get("stock"));

      const result = await createSneakerDrop({ title: rawTitle, price: rawPrice, stock: rawStock });

      /**
       * Ошибки валидации приходят от `next-safe-action`, если payload не прошел Zod-схему.
       *
       * Эти ошибки раскладываются по полям формы, чтобы UI мог показать сообщение рядом с
       * конкретным input.
       */
      if (result?.validationErrors) {
        return {
          success: false,
          productId: null,
          error: null,
          validationErrors: {
            title: result.validationErrors.title?._errors,
            price: result.validationErrors.price?._errors,
            stock: result.validationErrors.stock?._errors,
          },
        } satisfies FormState;
      }

      /**
       * `serverError` означает, что action упал на сервере уже после успешной валидации.
       *
       * Например, внешний API вернул ошибку или внутри action был выброшен exception.
       */
      if (result?.serverError) {
        return {
          success: false,
          productId: null,
          error: result.serverError,
          validationErrors: {},
        } satisfies FormState;
      }

      /**
       * Успешный результат содержит id созданного товара.
       *
       * После этого UI показывает зеленый success-блок, а старые ошибки очищаются.
       */
      if (result?.data?.success) {
        return {
          success: true,
          productId: result?.data?.productId ?? null,
          error: null,
          validationErrors: {},
        } satisfies FormState;
      }

      /**
       * Fallback на предыдущее состояние нужен для неожиданных ответов, когда нет ни ошибки, ни
       * успешного результата.
       */
      return prevState;
    },
    initialState,
  );

  return (
    <main className="p-5">
      <h2>Тестирование Server Action</h2>
      <form action={formAction} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium">
            Название модели:
          </label>

          <input
            type="text"
            id="title"
            name="title"
            disabled={isPending}
            className="w-full border rounded px-3 py-2 disabled:opacity-50"
          />

          {state.validationErrors.title && (
            <span className="text-red-500 text-xs">{state.validationErrors.title.join(", ")}</span>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-1 text-sm font-medium">
            Цена:
          </label>

          <input
            type="number"
            id="price"
            name="price"
            min={0}
            step="0.01"
            disabled={isPending}
            className="w-full border rounded px-3 py-2 disabled:opacity-50"
          />

          {state.validationErrors.price && (
            <span className="text-red-500 text-xs">{state.validationErrors.price.join(", ")}</span>
          )}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block mb-1 text-sm font-medium">
            Количество:
          </label>

          <input
            type="number"
            id="stock"
            name="stock"
            min={0}
            step="1"
            disabled={isPending}
            className="w-full border rounded px-3 py-2 disabled:opacity-50"
          />

          {state.validationErrors.stock && (
            <span className="text-red-500 text-xs">{state.validationErrors.stock.join(", ")}</span>
          )}
        </div>

        {/* Server error */}
        {state.error && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        {/* Success */}
        {state.success && (
          <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-600">
            Товар успешно создан. ID: {state.productId}
          </div>
        )}

        <FormButtonComponent />
      </form>
    </main>
  );
}
