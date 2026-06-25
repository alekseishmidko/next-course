import { NextRequest, NextResponse } from "next/server";

/**
 * Описывает параметры динамического API route `/api/users/[id]`.
 *
 * В Next.js App Router `params` в route handlers передаются через context. В текущей версии проекта
 * `params` типизированы как `Promise`, поэтому перед чтением `id` используется `await`.
 */
interface UserRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * API endpoint: `GET /api/users/[id]`.
 *
 * Назначение:
 * - принимает динамический `id` из URL, например `/api/users/42`;
 * - читает query parameter `fields`, например `/api/users/42?fields=name,email`;
 * - возвращает JSON с `targetId`, `fields` и демонстрационным custom header.
 *
 * Этот route handler показывает типичный HTTP API-сценарий: URL содержит идентификатор ресурса, а
 * query string уточняет, какие поля или параметры нужны клиенту.
 *
 * Отличие от server action:
 * - этот handler можно вызвать прямым HTTP-запросом из любого клиента;
 * - HTTP-статус, headers и query string являются частью контракта endpoint;
 * - server action лучше подходит для внутренних мутаций из React-компонентов, например submit
 *   формы, где Next сам связывает клиентский вызов с серверной функцией.
 *
 * @example
 * GET /api/users/42?fields=name,email
 *
 * @returns JSON вида `{ ok: true, targetId: "42", fields: "name,email" }`.
 */
export async function GET(request: NextRequest, context: UserRouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);

  const fields = searchParams.get("fields");
  return NextResponse.json(
    { ok: true, targetId: id, fields: fields },
    { status: 200, headers: { "X-Custom-Header": "example" } },
  );
}
