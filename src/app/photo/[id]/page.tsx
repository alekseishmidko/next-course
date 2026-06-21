import { CARS } from "@/shared/constants/cars";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Описывает параметры обычной страницы фотографии `/photo/[id]`.
 *
 * @property params Promise с динамическим `id`, который используется для поиска машины.
 */
interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Полноэкранная страница выбранной машины.
 *
 * Используется при прямом открытии или обновлении `/photo/[id]`. Если машина с таким `id` не
 * найдена, вызывает `notFound()` и передает управление 404-странице.
 */
export default async function PhotoPage(props: PhotoPageProps) {
  const { params } = props;
  const { id } = await params;
  const car = CARS.find((c) => c.id === id);

  if (!car) {
    return notFound();
  }

  return (
    <main className="min-h-dvh bg-black px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl items-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-80 bg-zinc-900 p-8">
            <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>The Garage</span>
              <span>#{car.id.padStart(2, "0")}</span>
            </div>

            <div className="flex h-full items-end">
              <div className="w-full">
                <div className="mb-8 h-36 rounded-xl border border-zinc-700 bg-[linear-gradient(135deg,#18181b_0%,#27272a_45%,#0f172a_100%)] p-6">
                  <div className="flex h-full items-end justify-between">
                    <div className="h-10 w-10 rounded-full border-4 border-zinc-400 bg-black" />
                    <div className="mb-4 h-10 flex-1 rounded-full bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.25)]" />
                    <div className="h-10 w-10 rounded-full border-4 border-zinc-400 bg-black" />
                  </div>
                </div>

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                  Selected car
                </p>
                <h1 className="mt-3 text-5xl font-black uppercase italic tracking-tight">
                  {car.name}
                </h1>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between p-8">
            <div>
              <p className="text-sm leading-6 text-zinc-400">
                Детальная страница открывается напрямую по адресу{" "}
                <span className="font-mono text-zinc-200">/photo/{id}</span>. Если перейти сюда с
                главной страницы, Next.js может показать тот же маршрут через intercepted modal.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Model
                  </p>
                  <p className="mt-1 text-lg font-semibold">{car.name}</p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Route param
                  </p>
                  <p className="mt-1 font-mono text-lg text-amber-300">{id}</p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex w-fit items-center rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
            >
              Вернуться в гараж
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
