import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/**
 * Генерирует SEO-метаданные для страницы товара.
 *
 * Функция выполняется на сервере до рендера страницы.
 * Next.js использует возвращаемый объект для формирования
 * содержимого тега <head>.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  /**
   * Получаем параметры маршрута.
   */
  const { category, slug } = await params;

  /**
   * Загружаем информацию о товаре.
   */
  const res = await fetch(`https://dummyjson.com/products/${slug}`);

  /**
   * Если товар не найден,
   * возвращаем пустой объект метаданных.
   */
  if (!res.ok) {
    return {};
  }

  /**
   * Преобразуем ответ сервера в объект.
   */
  const product = await res.json();

  /**
   * Возвращаем SEO-метаданные страницы.
   */
  return {
    title: `Продукт "${product.title}"`,
    description: `Доступно в категории "${category}". Цена: $${product.price}`,
  };
}
/**
 * Страница отображения конкретного товара.
 *
 * URL имеет вид:
 * /products/[category]/[slug]
 */
export default async function ProductPage({ params }: PageProps) {
  /**
   * Получаем параметры маршрута.
   */
  const { category, slug } = await params;

  /**
   * Загружаем информацию о товаре по его slug (id).
   */
  const res = await fetch(`https://dummyjson.com/products/${slug}`);

  /**
   * Если товар отсутствует,
   * отображаем стандартную страницу 404.
   */
  if (!res.ok) {
    notFound();
  }

  /**
   * Преобразуем ответ сервера в объект.
   */
  const product = await res.json();

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl mt-10">
      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
        {category}
      </span>

      <h1 className="text-3xl font-bold text-white mt-2">{product.title}</h1>

      <p className="text-gray-400 mt-4">{product.description}</p>

      <div className="text-2xl font-mono text-white mt-6">${product.price}</div>
    </div>
  );
}
