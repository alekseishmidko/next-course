/**
 * Пустое состояние parallel route `@modal`.
 *
 * Next.js рендерит этот компонент, когда для слота `@modal` нет активного модального маршрута.
 * Благодаря этому основной layout всегда может безопасно выводить `{modal}`.
 */
export default function DefaultModal() {
  return <></>;
}
