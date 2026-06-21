"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type Project = {
  id: number;
  title: string;
  desc: string;
  category: string;
  stars: number;
  date: string;
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Next.js SaaS Dashboard",
    desc: "Админ-панель для управления пользователями, подписками и аналитикой.",
    category: "nextjs",
    stars: 842,
    date: "2026-06-20",
  },
  {
    id: 2,
    title: "Realtime Chat Platform",
    desc: "Чат-платформа на WebSocket с поддержкой комнат и уведомлений.",
    category: "nestjs",
    stars: 631,
    date: "2026-06-03",
  },
  {
    id: 3,
    title: "Crypto Exchange API",
    desc: "Микросервисная биржа с ордерами, кошельками и торговыми парами.",
    category: "typescript",
    stars: 1280,
    date: "2026-05-28",
  },
  {
    id: 4,
    title: "Edge Authentication Service",
    desc: "Быстрая авторизация на базе Elysia и Redis, развернутая на Edge-функциях.",
    category: "elysia",
    stars: 210,
    date: "2026-05-12",
  },
  {
    id: 5,
    title: "Pinterest Automation Bot",
    desc: "Автоматическая публикация контента и генерация описаний через AI.",
    category: "automation",
    stars: 475,
    date: "2026-04-30",
  },
  {
    id: 6,
    title: "AI Real Estate Assistant",
    desc: "Подбор недвижимости через Telegram/Zalo бота с интеграцией Google Sheets.",
    category: "ai",
    stars: 954,
    date: "2026-04-15",
  },
];

const QUERY = "query";
const CATEGORY = "category";
const SORT = "sort";

const MS = 300;
export function ProjectLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get(QUERY) ?? "");
  const category = searchParams.get(CATEGORY) ?? "all";
  const sort = searchParams.get(SORT) ?? "newest";

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set(QUERY, searchQuery);
      } else {
        params.delete(QUERY);
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    }, MS);

    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router]);

  const filteredProjects = useMemo(() => {
    const urlQuery = searchParams.get(QUERY) || "";

    return PROJECTS.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(urlQuery.toLowerCase());

      const matchesCategory = category === "all" || p.category === category;

      return matchesQuery && matchesCategory;
    }).sort((a, b) => {
      if (sort === "popular") {
        return b.stars - a.stars;
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [searchParams, category, sort]);
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };
  return (
    <div className="min-h-screen bg-black text-zinc-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
            Project Library
          </h1>

          <p className="text-zinc-500 font-medium">
            Управление состоянием: Поиск, Фильтры, Сортировка.
          </p>
        </div>

        <div className="h-8 flex items-center">
          {isPending && (
            <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Синхронизация...
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Поиск
            </label>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Название или описание..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Технология
            </label>

            <div className="flex flex-wrap gap-2">
              {["all", "elysia", "nextjs"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParams("category", cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Сортировка
            </label>

            <select
              value={sort}
              onChange={(e) => updateParams("sort", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"
            >
              <option value="newest">Сначала новые</option>
              <option value="popular">Самые популярные</option>
            </select>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-blue-600/10 text-blue-500 px-2 py-1 rounded uppercase">
                    {project.category}
                  </span>

                  <span className="text-xs font-mono text-zinc-600">{project.stars} ★</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-zinc-500 leading-relaxed">{project.desc}</p>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-medium">Ничего не найдено</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
