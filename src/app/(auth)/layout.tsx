import { ReactNode } from "react";

/**
 * Описывает свойства layout-компонента группы авторизации.
 *
 * @property children Страница авторизации, которая будет показана внутри общей auth-обертки.
 */
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout для route group `(auth)`.
 *
 * Route group не добавляет сегмент в URL, но позволяет дать страницам логина и регистрации
 * отдельную визуальную обертку: центрированный контейнер, темный фон, header и footer.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-zinc-950
        bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))]
        from-zinc-900
        via-zinc-950
        to-black
      "
    >
      <div
        className="
          w-full
          max-w-md
          p-10
          bg-zinc-900/50
          border
          border-zinc-800
          rounded-[2.5rem]
          shadow-2xl
          backdrop-blur-sm
        "
      >
        <header className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-black rounded-full" />
          </div>

          <h2 className="text-white text-xl font-bold tracking-tight">Welcome back</h2>

          <p className="text-zinc-500 text-sm mt-1">Enter your details to continue</p>
        </header>

        {children}

        <footer className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-widest">
          Secure Authentication
        </footer>
      </div>
    </div>
  );
}
