import Link from "next/link";
import { CARS } from "@/shared/constants/cars";

/**
 * Главная страница гаража.
 *
 * Выводит список машин из `CARS`. Переход по карточке ведет на `/photo/[id]`; при клиентской
 * навигации этот маршрут перехватывается parallel route `@modal` и открывается как модальное окно.
 */
export default function Home() {
  return (
    <main className="p-10 bg-black min-h-screen">
      <h1 className="text-3xl font-black text-white mb-10 uppercase italic">The Garage</h1>

      <div className="flex gap-4">
        {CARS.map((car) => (
          <Link
            key={car.id}
            href={`/photo/${car.id}`}
            className="
              p-6
              bg-zinc-900
              border
              border-zinc-800
              rounded-xl
              text-white
              hover:border-blue-500
              transition-all
            "
          >
            {car.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
