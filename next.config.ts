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
  allowedDevOrigins: ["127.0.0.1", "127.0.2.2"],
  cacheComponents: true,
};

export default nextConfig;
