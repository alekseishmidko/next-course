import type { MetadataRoute } from "next";

/**
 * Генерирует sitemap.xml.
 *
 * Функция вызывается Next.js автоматически при обращении
 * к маршруту /sitemap.xml.
 *
 * Возвращает список страниц сайта, которые необходимо
 * проиндексировать поисковым системам.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /**
   * Базовый адрес сайта.
   *
   * Если переменная окружения отсутствует,
   * используется адрес по умолчанию.
   */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teacoder.ru";

  /**
   * Список статических страниц сайта.
   *
   * Для каждой страницы можно указать:
   * - url — полный адрес страницы;
   * - lastModified — дата последнего изменения;
   * - changeFrequency — предполагаемая частота обновления;
   * - priority — приоритет страницы для поисковых систем.
   */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      /**
       * Главная страница сайта.
       */
      url: baseUrl,

      /**
       * Дата последнего изменения страницы.
       */
      lastModified: new Date(),

      /**
       * Главная страница обновляется ежедневно.
       */
      changeFrequency: "daily",

      /**
       * Максимальный приоритет индексации.
       */
      priority: 1.0,
    },
    {
      /**
       * Страница контактов.
       */
      url: `${baseUrl}/contacts`,

      /**
       * Дата последнего изменения страницы.
       */
      lastModified: new Date(),

      /**
       * Контактная информация обновляется редко.
       */
      changeFrequency: "monthly",

      /**
       * Средний приоритет относительно главной страницы.
       */
      priority: 0.5,
    },
  ];

  /**
   * Возвращаем список страниц,
   * который Next.js преобразует в sitemap.xml.
   */
  return staticRoutes;
}
