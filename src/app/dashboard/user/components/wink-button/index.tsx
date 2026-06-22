"use client";

/**
 * Описывает свойства кнопки действия для пользователя.
 *
 * @property name Имя пользователя, которое будет подставлено в текст уведомления.
 */
interface WinkButtonProps {
  name: string;
}

/**
 * Клиентская кнопка действия для карточки пользователя.
 *
 * Компонент вынесен отдельно, потому что использует browser API `alert`. Server component страницы
 * передает сюда только имя пользователя, а обработчик клика выполняется уже в браузере.
 */
export function WinkButton({ name }: WinkButtonProps) {
  return (
    <button onClick={() => alert(`Вы подмигнули ${name}!`)} className="ml-4">
      Подмигнуть
    </button>
  );
}
