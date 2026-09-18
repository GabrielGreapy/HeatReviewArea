import { useEffect, useState } from "react";
import ReloadLogs from "./config-components/reloadComponents";
import { collection, getCountFromServer, getDocs } from "firebase/firestore";
import { dbClient } from "@/app/lib/firebase-client";

export default function SectionAnalisis() {
  const [establishmentsAnalized, setEstablishmentsAnalized] = useState<number | null>(null);
  const [ grabbedReviews, setGrabbedReviews] = useState<number | null>(null)
  const searchMetrics = async () => {
    const dbRef = collection(dbClient, "places");
    const snapshot = await getCountFromServer(dbRef);
    setEstablishmentsAnalized(snapshot.data().count)

    const docSnapshot = await getDocs(dbRef);
    let totalReviews = 0;
    docSnapshot.forEach((doc) => {
        const data = doc.data();
        totalReviews += data.totalReviews || 0;
        
    })
    setGrabbedReviews(totalReviews);
  }
  useEffect( () => {
    searchMetrics();
    console.log("Reload")
  },[])


  return (
    <section className="w-full px-4 py-8 md:px-8 md:py-12 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2 max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[16px] text-amber-500">
                database
              </span>
             
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Cidades Arquivadas &amp; Histórico de Scraping
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Painel central de ingestão assíncrona, mineradores distribuídos de resenhas turísticas por município monitorado.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <ReloadLogs onReload={ searchMetrics }/>

           
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Estabelecimentos monitorados
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  location_city
                </span>
              </div>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {establishmentsAnalized}
                </span>
                
              </div>
            </div>

            
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Reviews Mineradas
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  reviews
                </span>
              </div>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  { grabbedReviews }
                </span>
                
              </div>
            </div>

            
          </div>

         

         
          

        </div>
      </div>
    </section>
  );
}