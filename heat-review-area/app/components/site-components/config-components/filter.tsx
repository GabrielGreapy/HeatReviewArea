"use client";

import { useFilterContext } from "@/app/context/FilterContext";

export default function Filter() {
  const { filteringBy, setFilteringBy } = useFilterContext();

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              grid_view
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Filtros de Divisão Geográfica e Sentimento
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            A cidade é dividida em quadrantes coloridos dependendo da média e do volume de reviews em tempo real.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm self-start md:self-auto">
          4 Níveis Disponíveis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="viewModeContainer">
        
        {/* Level 1: Ruas / Quadrantes */}
        <label
          className={`relative flex flex-col p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer ${
            filteringBy === "streets"
              ? "ring-2 ring-primary opacity-100"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <input
            checked={filteringBy === "streets"}
            onChange={() => setFilteringBy("streets")}
            className="sr-only peer"
            name="view_mode"
            type="radio"
            value="streets"
          />
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                filteringBy === "streets"
                  ? "bg-primary-fixed/40 text-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">grid_4x4</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                filteringBy === "streets" ? "border-primary" : "border-outline-variant"
              }`}
            >
              {filteringBy === "streets" && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="font-headline-sm text-[17px] font-bold text-on-surface mb-1">
            Ruas / Quadrantes
          </span>
          
          <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Agrupamento por ruas</span>
            <span className={filteringBy === "streets" ? "text-primary font-semibold" : "text-on-surface-variant"}>
              {filteringBy === "streets" ? "Ativo no visor" : "Alternar modo"}
            </span>
          </div>
        </label>

        {/* Level 2: Bairros */}
        <label
          className={`relative flex flex-col p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer ${
            filteringBy === "districts"
              ? "ring-2 ring-primary opacity-100"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <input
            checked={filteringBy === "districts"}
            onChange={() => setFilteringBy("districts")}
            className="sr-only peer"
            name="view_mode"
            type="radio"
            value="districts"
          />
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                filteringBy === "districts"
                  ? "bg-primary-fixed/40 text-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                filteringBy === "districts" ? "border-primary" : "border-outline-variant"
              }`}
            >
              {filteringBy === "districts" && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="font-headline-sm text-[17px] font-bold text-on-surface mb-1">
            Bairros
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Agrupamento por bairros.
          </p>
          <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Agrupamento Distrital</span>
            <span className={filteringBy === "districts" ? "text-primary font-semibold" : "text-on-surface-variant"}>
              {filteringBy === "districts" ? "Ativo no visor" : "Alternar modo"}
            </span>
          </div>
        </label>

        {/* Level 3: Estabelecimentos */}
        <label
          className={`relative flex flex-col p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer ${
            filteringBy === "establishments"
              ? "ring-2 ring-primary opacity-100"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <input
            checked={filteringBy === "establishments"}
            onChange={() => setFilteringBy("establishments")}
            className="sr-only peer"
            name="view_mode"
            type="radio"
            value="establishments"
          />
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                filteringBy === "establishments"
                  ? "bg-primary-fixed/40 text-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                filteringBy === "establishments" ? "border-primary" : "border-outline-variant"
              }`}
            >
              {filteringBy === "establishments" && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="font-headline-sm text-[17px] font-bold text-on-surface mb-1">
            Estabelecimentos
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Pontos individuais de hotéis, restaurantes, museus e atrações com notas e comentários.
          </p>
          <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Precisão por CNPJ/Ponto</span>
            <span className={filteringBy === "establishments" ? "text-primary font-semibold" : "text-on-surface-variant"}>
              {filteringBy === "establishments" ? "Ativo no visor" : "Alternar modo"}
            </span>
          </div>
        </label>

        {/* Level 4: Cidade Inteira */}
        <label
          className={`relative flex flex-col p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer ${
            filteringBy === "city"
              ? "ring-2 ring-primary opacity-100"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          <input
            checked={filteringBy === "city"}
            onChange={() => setFilteringBy("city")}
            className="sr-only peer"
            name="view_mode"
            type="radio"
            value="city"
          />
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                filteringBy === "city"
                  ? "bg-primary-fixed/40 text-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">location_city</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                filteringBy === "city" ? "border-primary" : "border-outline-variant"
              }`}
            >
              {filteringBy === "city" && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <span className="font-headline-sm text-[17px] font-bold text-on-surface mb-1">
            Cidade Inteira
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Visão macroscópica de toda a malha urbana e corredores turísticos consolidados.
          </p>
          <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Escala: Metropolitana</span>
            <span className={filteringBy === "city" ? "text-primary font-semibold" : "text-on-surface-variant"}>
              {filteringBy === "city" ? "Ativo no visor" : "Alternar modo"}
            </span>
          </div>
        </label>

      </div>
    </div>
  );
}