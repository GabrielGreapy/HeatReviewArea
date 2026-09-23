"use client";

import { dbClient } from "@/app/lib/firebase-client";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { LoadedAnalysis } from "@/app/types";

const PAGE_SIZE = 10;

export default function AnalizedCities() {
    const [loadedAnalisis, setLoadedAnalisis] = useState<LoadedAnalysis[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const [ lastItem, setLastItem] = useState<Record<number, QueryDocumentSnapshot>>({});
    const fetchTotalCount = async () => {
        try{
            const dbRef = collection( dbClient,  "scraping_jobs");
            const snapshot = await getCountFromServer(dbRef);
            setTotalItems(snapshot.data().count);
        } catch (error){
            console.error("Erro ao buscar total de registros: ", error);
        }
    }


    const loadPage = useCallback( async ( page : number) => {
        setLoading(true);

        try{
            const dbRef = collection( dbClient, "scraping_jobs");
            let q = query(dbRef, orderBy("createdAt",  "desc"), limit(PAGE_SIZE));
            if(page > 1 && lastItem[page - 1]){
                q = query(
                    dbRef,
                    orderBy("createdAt", "desc"),
                    startAfter(lastItem[ page -1]),
                    limit(PAGE_SIZE)
                );
            }
            const snapshot = await getDocs(q);

            if(!snapshot.empty){
                const lastDoc = snapshot.docs[snapshot.docs.length -1];
                setLastItem( prev => ({...prev, [page] : lastDoc}));
            }
            const analysis : LoadedAnalysis[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    cityName: String(data.locationQuery ?? data.searchString ?? data.cityName ?? "Cidade não informada"),
                    hourOfAnalisis: String(data.hourOfAnalisis ?? data.createdAt ?? ""),
                    status: (data.status ?? "ERROR") as LoadedAnalysis["status"],
                }
            });
            setLoadedAnalisis(analysis);
            setCurrentPage(page);
        }catch(error){
            console.error("Erro ao carregar dados pagiinados : " , error)
        } finally{
            setLoading(false);
        }
    }, [lastItem]);


    useEffect(() => {
        void fetchTotalCount();
        void loadPage(1)
    }, []);

    const totalPages = Math.ceil( totalItems / PAGE_SIZE) || 1;


    const handlePageChange = (newPage : number) => {
        if ( newPage >= 1 && newPage <= totalPages && newPage !== currentPage){
            void loadPage(newPage)
        }
    }

    const firstItemIndex = totalItems > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    const lastItemIndex = Math.min(currentPage * PAGE_SIZE, totalItems)

    
    return (
        <div className="w-full xl:flex-1 flex flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            
            {/* Table Container */}
            <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="citiesTable">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                                <th className="py-4 px-6 w-1/3">Cidade / Estado</th>
                                <th className="py-4 px-4">Scrapings</th>
                                <th className="py-4 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-slate-400 dark:text-slate-500">
                                        Carregando registros...
                                    </td>
                                </tr>
                            ) : loadedAnalisis.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-slate-400 dark:text-slate-500">
                                        Nenhum registro de scraping encontrado.
                                    </td>
                                </tr>
                            ) : (
                                loadedAnalisis.map((item) => {
                                    const isSuccess = item.status === "COMPLETED";
                                    const isProcessing = item.status === "SCRAPING";
                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group"
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
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {item.cityName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Último Scraping */}
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        {item.hourOfAnalisis || "Sem data"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                                        isSuccess
                                                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                                                            : isProcessing
                                                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                                                            : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        {isSuccess ? "check_circle" : isProcessing ? "sync" : "error"}
                                                    </span>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Controles de Paginação */}
                <div className="px-6 py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Exibindo <strong className="text-slate-800 dark:text-slate-200">{firstItemIndex}</strong> a <strong className="text-slate-800 dark:text-slate-200">{lastItemIndex}</strong> de <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> cidades monitoradas
                    </span>

                    <div className="flex items-center gap-1.5">
                        {/* Botão Anterior */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                currentPage === 1 || loading
                                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                        >
                            Anterior
                        </button>

                        {/* Botões Numéricos das Páginas */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={loading}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                    pageNumber === currentPage
                                        ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        {/* Botão Próxima */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0 || loading}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                currentPage === totalPages || totalPages === 0 || loading
                                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}