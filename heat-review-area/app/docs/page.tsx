"use client";

export default function Docs() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-8 text-slate-800 dark:text-slate-100 transition-colors">
      <section className="flex flex-col gap-8" id="arquitetura">
        
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Visão Geral e Arquitetura
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Topologia de microsserviços assíncronos e orquestração do pipeline de dados
            </p>
          </div>
        </div>

        {/* Architectural Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Card 1: Next.js Frontend */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl flex flex-col justify-between hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all group">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                Camada 01
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Frontend Next.js (App Router)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Renderização por meio de API do Google Maps/Maps com mapa 2D. Desenhando elementos do mapa com o draw (extensão desta mesma API).
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>TailwindCSS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Design criado STITCH</span>
            </div>
          </div>

          {/* Card 2: Scraping Worker */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl flex flex-col justify-between hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all group">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Camada 02
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Scraping Workers e Actors
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fila gerada no APIFY, na seleção da API de codigo : nwua9Gu5YrADL7ZDj. 
                Ela faz o scrapping de lugares baseado no prompt do GooglMaps.
            
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span> • APIFY </span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold"> BOT ACTOR</span>
            </div>
          </div>

          {/* Card 3: NLP Pipeline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl flex flex-col justify-between hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all group">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                Camada Abstrata
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Motivos &amp; Interesses 
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  A criação desta aplicação foi extremamente util para aprender como o processo funciona. Tambem haverá uma documentação do processo.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Criativos • Sentimentos</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">10/10</span>
            </div>
          </div>

          {/* Card 4: Heatmap Grid Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl flex flex-col justify-between hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all group">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">grid_4x4</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                Camada 03
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Banco de Dados
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilize o FireStore do Firebase, já utilizei em projetos passados e com isso já tenho uma desenvoltura já com ele. Entre escolhas tinha o MongoDb.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Firebase • Firestore</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Sub-metro Precision</span>
            </div>
          </div>

        </div>

        {/* Architectural Sequence Flow Graphic */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Fluxo Sequencial de Atualização dos Quadrantes
            </span>
            <span className="self-start sm:self-auto text-[11px] font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-full text-slate-600 dark:text-slate-300">
              Pipeline Assíncrono
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-sky-500/40 transition-colors">
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                01. DISPARO
              </span>
              <span className="material-symbols-outlined text-sky-600 dark:text-sky-400 text-[22px]">
                schedule
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Cron Job de Scraping
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Intervalo configurado por cidade (6h - 24h)
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-amber-500/40 transition-colors">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                02. CAPTURA
              </span>
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[22px]">
                cloud_sync
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Coleta &amp; Deduplicação
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Matching por coordenadas e place_id
              </span>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-rose-500/40 transition-colors">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                03. NLP BATCH
              </span>
              <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[22px]">
                model_training
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Scoring Semântico
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Atribuição de score de polaridade e confiança
              </span>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-indigo-500/40 transition-colors">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                04. KERNEL DENSITY
              </span>
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[22px]">
                grain
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Interpolação Espacial
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Cálculo do vetor térmico por quadrante H3
              </span>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-2 hover:border-emerald-500/40 transition-colors">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                05. DISPATCH
              </span>
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[22px]">
                cached
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Busting de Cache Edge
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Revalidação instantânea no mapa interativo
              </span>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}