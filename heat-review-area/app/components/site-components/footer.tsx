"use client"

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Coluna 1: Branding & Autor */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-2xl">
                thermostat
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ThermoTurismo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desenvolvido por{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Gabriel Martins
              </span>
            </p>
          </div>

          {/* Coluna 2: APIs Utilizadas */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              APIs Utilizadas
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">
                  check_circle
                </span>
                <span>Google Places AutoComplete</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">
                  check_circle
                </span>
                <span>Google Maps API</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">
                  check_circle
                </span>
                <span>Apify Google Maps Scraper</span>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Documentação */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Documentação
            </h3>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
            >
              <span>Acessar documentação do projeto</span>
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Coluna 4: Status / Badge */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ambiente
            </h3>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Pesquisa &amp; Academic
            </span>
          </div>

        </div>

        {/* Divisória e Disclaimer Legal */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <p className="max-w-3xl">
            Esta aplicação foi desenvolvida exclusivamente para fins acadêmicos e de estudo de consumo de APIs. Não há propriedade sobre os serviços listados. Todos os dados coletados passam por processo de anonimização para garantia de privacidade.
          </p>
          <p className="shrink-0 text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ThermoTurismo
          </p>
        </div>
      </div>
    </footer>
  );
}