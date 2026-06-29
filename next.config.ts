import type { NextConfig } from "next";

/**
 * Конфигурация Next.js для проекта.
 *
 * `cacheComponents: true` включает Cache Components, необходимые для директивы `"use cache"`,
 * `cacheLife()` и `cacheTag()` в `app/products`.
 *
 * @example
 * // Без cacheComponents: true директива "use cache" не будет работать как Cache Components API.
 */
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1", "127.0.2.2", "172.16.5.89"],
  images: {
    /**
     * Форматы изображений, которые Next.js будет использовать
     * при оптимизации.
     */
    formats: ["image/avif", "image/webp"],

    /**
     * Минимальное время хранения оптимизированных изображений
     * в кеше CDN (в секундах).
     *
     * 31536000 = 1 год.
     */
    minimumCacheTTL: 31_536_000,

    /**
     * Способ отображения изображения браузером.
     *
     * inline — открывать изображение прямо в браузере.
     */
    contentDispositionType: "inline",

    /**
     * Набор поддерживаемых размеров экранов.
     *
     * Используется компонентом next/image
     * для генерации адаптивных изображений.
     */
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840],

    /**
     * Дополнительные размеры изображений
     * для иконок, аватаров и небольших элементов интерфейса.
     */
    imageSizes: [12, 16, 24, 32, 48, 64, 96, 128, 256, 512],

    /**
     * Разрешенные локальные изображения.
     *
     * Все изображения внутри /assets/avatars
     * смогут использоваться через next/image.
     */
    // localPatterns: [
    //   {
    //     pathname: "/assets/avatars/**",
    //   },
    // ],

    /**
     * Список внешних ресурсов,
     * изображения с которых разрешено оптимизировать.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "**.kinopoisk.ru",
        port: "",
      },
    ],
  },
};

export default nextConfig;
