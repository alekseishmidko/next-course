import { CARS } from "@/shared/constants/cars";
import { CloseButton } from "@/app/@modal/(.)photo/[id]/components/close-button";

/**
 * Описывает параметры intercepted modal маршрута `/photo/[id]`.
 *
 * @property params Promise с динамическим `id`, по которому находится машина для модального окна.
 */
interface PhotoModalProps {
  params: Promise<{ id: string }>;
}

/**
 * Intercepting route для просмотра машины в модальном окне.
 *
 * Папка `(.)photo` перехватывает соседний маршрут `/photo/[id]` при клиентском переходе, поэтому
 * пользователь остается на текущей странице, а содержимое `photo` открывается в parallel slot
 * `@modal`. При прямом открытии `/photo/[id]` должен рендериться обычный маршрут `photo/[id]`.
 */
export default async function PhotoModal({ params }: PhotoModalProps) {
  const { id } = await params;

  const car = CARS.find((c) => c?.id === id);

  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-2xl">
      <div className="w-full max-w-lg rounded-4xl border border-zinc-800 bg-zinc-950 p-12 shadow-2xl">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-blue-500">
          Intercepted
        </span>

        <h2 className="mb-6 text-5xl font-black uppercase italic text-white">{car.name}</h2>

        <p className="mb-8 text-zinc-500">
          Этот контент перехвачен. Вы видите его в модалке, но в адресной строке путь /photo/{id}.
        </p>
      </div>

      <CloseButton />
    </div>
  );
}
