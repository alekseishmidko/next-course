import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy-обработчик Next.js для подготовки security headers перед рендерингом страниц.
 *
 * Что делает:
 * - создает nonce для текущего запроса;
 * - собирает Content Security Policy;
 * - прокидывает nonce и CSP дальше в request headers;
 * - добавляет CSP в response headers, чтобы браузер применил политику безопасности.
 *
 * Proxy выполняется до route/page handlers для URL, которые подходят под `config.matcher`.
 * Это удобное место для общих заголовков безопасности, потому что логика применяется централизованно
 * ко всем страницам приложения.
 *
 * @example
 * // Браузер получает заголовок:
 * Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'
 *
 * @param request Входящий запрос Next.js.
 * @returns Ответ Next.js с обновленными request/response headers.
 */
export default function proxy(request: NextRequest) {
  /**
   * Генерируем случайный nonce.
   *
   * Он понадобится для безопасного выполнения inline-скриптов,
   * которым явно разрешено выполнение через атрибут nonce.
   */
  const nonce = btoa(crypto.randomUUID());

  /**
   * Формируем политику безопасности (Content Security Policy).
   *
   * В development дополнительно разрешается unsafe-eval,
   * поскольку он необходим для работы некоторых инструментов разработки
   * (например React Fast Refresh).
   */
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  /**
   * Копируем все входящие заголовки запроса,
   * чтобы добавить собственные значения.
   */
  const requestHeaders = new Headers(request.headers);

  /**
   * Передаем nonce дальше в приложение.
   *
   * Его можно использовать при рендеринге страницы,
   * чтобы проставить nonce для inline-скриптов.
   */
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  /**
   * Добавляем CSP в заголовки запроса.
   */
  requestHeaders.set("Content-Security-Policy", cspHeader);

  /**
   * Создаем новый ответ и передаем обновленные заголовки
   * следующему обработчику.
   */
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  /**
   * Также добавляем CSP в заголовки ответа браузеру.
   *
   * Именно этот заголовок браузер использует
   * для применения политики безопасности.
   */
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

/**
 * Конфигурация matcher для proxy.
 *
 * Proxy применяется ко всем пользовательским страницам, но пропускает:
 * - `/api/*`, чтобы не вмешиваться в API endpoints;
 * - `/_next/static/*` и `/_next/image/*`, чтобы не ломать serving статических ресурсов;
 * - `*.png`, чтобы не добавлять лишнюю обработку для png-файлов.
 */
export const config = { matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"] };
