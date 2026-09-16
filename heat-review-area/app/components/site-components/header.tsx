"use client";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-secondary-fixed-dim via-primary-fixed-dim to-primary"></div>
      
      <div className="h-16 w-full px-8 flex items-center justify-between gap-4">
        {/* Lado Esquerdo: Logo e Título */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-[0_2px_8px_rgba(141,75,0,0.12)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" onClick={ () => router.push("/")}>
  <defs
  >
    <linearGradient id="heatGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#38bdf8"/>
      <stop offset="45%" stopColor="#f59e0b"/>
      <stop offset="100%" stopColor="#ef4444"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#f8fafc"/>
  <circle cx="32" cy="32" r="22" fill="url(#glowGrad)"/>
  <path d="M32 14C23.16 14 16 21.16 16 30c0 10.5 14 20 16 20s16-9.5 16-20c0-8.84-7.16-16-16-16zm0 24a8 8 0 110-16 8 8 0 010 16z" fill="url(#heatGrad)"/>
  <circle cx="32" cy="30" r="4" fill="#ffffff"/>
  <path d="M22 48h20v2H22z" fill="#cbd5e1"/>
</svg>
          </div>
          <div className="flex flex-col" onClick={ () => router.push("/")}>
            <div className="flex items-center gap-1"
            >
              <a className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface" href=""> 
                ThermoTurismo
              </a>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Monitoramento de Turismo Urbano
            </span>
          </div>
        </div>

        {/* Lado Direito: Navegação + API Docs */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-end p-1.5 bg-surface-container-low rounded-xl">
            
            <a
              className="px-4 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
              data-path="analise-termica"
              onClick={() => router.push("/analises")}
              href=""
            >
              Análises guardadas
            </a>
          </nav>

          <div className="h-5 w-[1px] bg-surface-container-high hidden sm:block"></div>

          <a
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
            data-path="api-docs"
            href=""
            onClick={() => router.push("/docs")}
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            API Docs
          </a>
        </div>
      </div>
    </header>
  );
}