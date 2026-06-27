import { Suspense } from "react";

/**
 * Загружает профиль организации Vercel из GitHub API без кеширования.
 *
 * Здесь используется `cache: "no-store"`, поэтому каждый запрос к странице заново идет во внешний
 * API. Это противоположность `cache: "force-cache"` и Cache Components:
 *
 * @example
 * // no-store:
 * // refresh страницы -> новый запрос к GitHub API
 *
 * // force-cache:
 * // refresh страницы -> Next может вернуть сохраненный ответ из кеша
 *
 * Такой режим полезен для данных, которые должны быть максимально свежими, но он медленнее и
 * сильнее нагружает внешний API.
 */
export async function getGithubProfile() {
  const res = await fetch("https://api.github.com/orgs/vercel", {
    // cache: "force-cache",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch github profile");
  }

  return res.json();
}

/**
 * Блок профиля GitHub с uncached server-side загрузкой.
 *
 * Компонент намеренно отделен от страницы и рендерится внутри `<Suspense>`, потому что при
 * `cacheComponents: true` uncached данные (`cache: "no-store"`) не должны блокировать весь route.
 */
async function GithubProfile() {
  const data = await getGithubProfile();

  return (
    <section>
      <h2>Профиль: {data.name}</h2>
      <p>Desc: {data.description}</p>
      <p>Public Repos: {data.public_repos}</p>
    </section>
  );
}

/**
 * Главная страница с примером динамической server-side загрузки.
 *
 * Страница отдает статический shell сразу, а динамический блок GitHub профиля догружается внутри
 * Suspense boundary. Это устраняет ошибку Next.js `blocking-route` для uncached data.
 */
export default function Home() {
  return (
    <main className="p-10 bg-black text-white min-h-screen">
      <Suspense fallback={<p className="text-zinc-400">Загрузка профиля...</p>}>
        <GithubProfile />
      </Suspense>
    </main>
  );
}
