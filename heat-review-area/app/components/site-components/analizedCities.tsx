"use client";

import { dbClient } from "@/app/lib/firebase-client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LoadedAnalysis } from "@/app/types";


export default function AnalizedCities() {
    const [loadedAnalisis, setLoadedAnalisis] = useState<LoadedAnalysis[]>([])
    const loadData = async () => {
        const dbRef = collection(dbClient, "scraping_jobs")
        const q = query(dbRef, orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        const analysis: LoadedAnalysis[] = snapshot.docs.map((document) => {
            const data = document.data();
            return {
                id: document.id,
                cityName : String(data.locationQuery ?? data.searchString ?? data.cityName ?? "Cidade não informada"),
                hourOfAnalisis : String( data.hourOfAnalisis ?? data.createdAt ?? ""),
                status : ( data.status ?? "ERROR") as LoadedAnalysis["status"],
            }
        })
        setLoadedAnalisis( analysis)
    }
    useEffect(() => {
        void loadData()
    }, [])

  return (
    <div className="w-full xl:flex-1 flex flex-col gap-6 p-4 md:p-6 bg-slate-50 text-slate-900 min-h-screen">
      
      {/* Header & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px] group">
          <span className="material-symbols-outlined text-[20px] text-slate-400 group-focus-within:text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors">
            search
          </span>
          <input
            id="citySearchInput"
            type="text"
            placeholder="Pesquisar cidade, estado ou tag térmica..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-100/70 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filters Segment */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              id="statusFilter"
              className="appearance-none text-xs font-semibold bg-slate-100/70 border border-slate-200 text-slate-700 py-2.5 pl-3.5 pr-9 rounded-xl cursor-pointer hover:bg-slate-200/60 hover:text-slate-900 transition-all focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Status: Todos</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="PROCESSANDO">Em Processamento</option>
              <option value="AGENDADO">Agendado</option>
              <option value="FALHA">Falha</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <select
              id="regionFilter"
              className="appearance-none text-xs font-semibold bg-slate-100/70 border border-slate-200 text-slate-700 py-2.5 pl-3.5 pr-9 rounded-xl cursor-pointer hover:bg-slate-200/60 hover:text-slate-900 transition-all focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Região: Todas</option>
              <option value="SUDESTE">Sudeste</option>
              <option value="SUL">Sul</option>
              <option value="NORDESTE">Nordeste</option>
              <option value="CENTRO_OESTE">Centro-Oeste</option>
              <option value="NORTE">Norte</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Clear Filter Button */}
          <button
            id="resetFilters"
            title="Limpar filtros"
            className="p-2.5 text-slate-500 hover:text-rose-600 rounded-xl bg-slate-100/70 border border-slate-200 hover:bg-rose-50 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="citiesTable">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-4 px-6 w-1/3">Cidade / Estado</th>
                <th className="py-4 px-4">Último Scraping</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              
              {loadedAnalisis. length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                        Nenhum registro de scraping encontrado.
                    </td>
                </tr>
              ) : (
                loadedAnalisis.map((item) => {
                    const isSuccess = item.status === "COMPLETED";
                    const isProcessing = item.status === "SCRAPING"
                    return(
                        <tr
                        key={item.id}
                        className="hover:bg-indigo-50/50 transition-all cursor-pointer group"
                        >
                        {/* Cidade / Estado */}
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                            <div className="relative flex h-2.5 w-2.5">
                                <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                    isSuccess ? "bg-emerald-400" : isProcessing ? "bg-amber-400" : "bg-rose-400"
                                }`}
                                />
                                <span
                                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                    isSuccess ? "bg-emerald-500" : isProcessing ? "bg-amber-500" : "bg-rose-500"
                                }`}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {item.cityName}
                                </span>
                            </div>
                            </div>
                        </td>

                        {/* Último Scraping */}
                        <td className="py-4 px-4">
                            <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-700">
                                {item.hourOfAnalisis || "Sem data"}
                            </span>
                            </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 text-center">
                            <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                isSuccess
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isProcessing
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                            >
                            <span className="material-symbols-outlined text-[14px]">
                                {isSuccess ? "check_circle" : isProcessing ? "sync" : "error"}
                            </span>
                            {item.status}
                            </span>
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                            <button
                                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                                title="Ver Mapa Térmico"
                            >
                                <span className="material-symbols-outlined text-[18px]">map</span>
                            </button>
                            <button
                                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all active:scale-95"
                                title="Refazer Scraping"
                            >
                                <span className="material-symbols-outlined text-[18px] hover:rotate-180 transition-transform duration-500">
                                sync
                                </span>
                            </button>
                            </div>
                        </td>
                        </tr>
                    );
                    })
                )}
             


            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Exibindo <strong className="text-slate-800">1</strong> de <strong className="text-slate-800">28</strong> cidades monitoradas
          </span>
          <div className="flex items-center gap-1.5">
            <button 
              disabled 
              className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            >
              Anterior
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
              Próxima
            </button>
          </div>
        </div>
      </div>

      
      

    </div>
  );
}