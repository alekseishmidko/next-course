import type { MetadataRoute } from "next";

interface SitemapProduct {
  id: number;
}

interface ProductsResponse {
  products: SitemapProduct[];
}

/**
 * Асинхронно генерирует динамические sitemap routes для товаров.
 *
 * В реальном проекте здесь часто используют базу данных:
 * `db.select().from(products)`, CMS API или внешний backend. Для примера используется DummyJSON.
 *
 * Если эта функция выбросит ошибку, `sitemap()` перехватит ее и вернет только `staticRoutes`.
 *
 * @example
 * // Для товара с id 12 функция вернет:
 * {
 *   url: "https://teacoder.ru/products/12",
 *   changeFrequency: "weekly",
 *   priority: 0.7
 * }
 */
async function getDynamicProductRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const response = await fetch("https://dummyjson.com/products?limit=5", {
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load products for sitemap");
  }

  const data = (await response.json()) as ProductsResponse;

  return data.products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

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
   * Пытаемся добавить динамические страницы.
   *
   * Если внешний источник данных недоступен, sitemap не должен падать полностью: поисковые системы
   * все равно получат статические страницы сайта.
   */
  try {
    const dynamicRoutes = await getDynamicProductRoutes(baseUrl);

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Sitemap dynamic routes error:", error);

    return staticRoutes;
  }
}
