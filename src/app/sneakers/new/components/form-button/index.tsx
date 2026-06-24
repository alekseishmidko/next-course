"use client";
import { useFormStatus } from "react-dom";

/**
 * Submit-кнопка формы создания товара.
 *
 * `useFormStatus()` читает состояние ближайшей родительской формы:
 * - `pending` становится `true`, пока выполняется form action;
 * - `data` содержит текущий `FormData` отправки.
 *
 * Компонент должен быть вложен внутрь `<form>`, иначе он не получит статус этой формы.
 *
 * @example
 * <form action={formAction}>
 *   <FormButtonComponent />
 * </form>
 */
export function FormButtonComponent() {
  const { data, pending: isPending } = useFormStatus();
  console.log(data);
  return (
    <button
      type="submit"
      disabled={isPending}
      className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {isPending ? "Создание..." : "Создать товар"}
    </button>
  );
}
