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
 * Главная страница с примером динамической server-side загрузки.
 *
 * Так как `getGithubProfile()` использует `no-store`, эта страница не полагается на кешированный
 * ответ GitHub API.
 */
export default async function Home() {
  const data = await getGithubProfile();

  return (
    <main className="p-10 bg-black text-white min-h-screen">
      <h2>Профиль: {data.name}</h2>
      <p>Desc: {data.description}</p>
      <p>Public Repos: {data.public_repos}</p>
    </main>
  );
}
