"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Barra de Acento Superior Gradient */}
      <div className="h-[3px] w-full bg-gradient-to-r from-sky-400 via-amber-500 to-rose-500" />

      <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Lado Esquerdo: Logo e Título */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          {/* Logo SVG */}
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              fill="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient
                  id="heatGrad"
                  x1="0"
                  y1="0"
                  x2="64"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient
                  id="glowGrad"
                  x1="12"
                  y1="12"
                  x2="52"
                  y2="52"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="16" fill="#f8fafc" />
              <circle cx="32" cy="32" r="22" fill="url(#glowGrad)" />
              <path
                d="M32 14C23.16 14 16 21.16 16 30c0 10.5 14 20 16 20s16-9.5 16-20c0-8.84-7.16-16-16-16zm0 24a8 8 0 110-16 8 8 0 010 16z"
                fill="url(#heatGrad)"
              />
              <circle cx="32" cy="30" r="4" fill="#ffffff" />
              <path d="M22 48h20v2H22z" fill="#cbd5e1" />
            </svg>
          </div>

          {/* Título e Subtítulo */}
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              ThermoTurismo
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Monitoramento de Turismo Urbano
            </span>
          </div>
        </Link>

        {/* Lado Direito: Navegação + API Docs */}
        <div className="flex items-center gap-3 md:gap-4">
          <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <Link
              href="/analises"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/analises"
                  ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Análises guardadas
            </Link>
          </nav>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <Link
            href="/docs"
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              pathname === "/docs"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs"
                : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              terminal
            </span>
            <span>API Docs</span>
          </Link>
        </div>
      </div>
    </header>
  );
}