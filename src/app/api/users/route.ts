import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint: `POST /api/users`.
 *
 * Назначение:
 * - принимает HTTP-запрос с JSON-телом;
 * - читает payload через `request.json()`;
 * - возвращает этот payload обратно в JSON-ответе со статусом `201 Created`.
 *
 * Такой route handler подходит для публичного HTTP API, которое можно вызвать не только из React,
 * но и из любого внешнего клиента: WebStorm HTTP Client, Postman, curl, мобильное приложение,
 * интеграция с другим backend-сервисом.
 *
 * Отличие API endpoint от server action:
 * - API endpoint имеет явный URL (`/api/users`) и HTTP-метод (`POST`);
 * - клиент сам формирует HTTP-запрос, headers и body;
 * - endpoint удобно документировать и тестировать через `.http` файл;
 * - server action вызывается как функция из Next/React-кода и обычно привязана к UI/form action;
 * - server action не предназначена как универсальный публичный REST endpoint для внешних клиентов.
 *
 * @example
 * POST /api/users
 * Content-Type: application/json
 *
 * {
 *   "name": "Alex",
 *   "email": "alex@example.com"
 * }
 *
 * @returns JSON вида `{ payload: body }` со статусом `201`.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({ payload: body }, { status: 201 });
}
