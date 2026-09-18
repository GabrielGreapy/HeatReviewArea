"use client"

import { useState } from "react";

interface ReloadLogProps{
    onReload : () => void;
}



export default function ReloadLogs({onReload} : ReloadLogProps){
    


    return(
        <button
              type="button"
              id="btnRefreshTelemetry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.98]"
              onClick={ () => {onReload}}
            >
              <span
                id="syncIconGlobal"
                className="material-symbols-outlined text-[18px] text-slate-500 transition-transform duration-500"
              >
                sync
              </span>
              <span>Atualizar Logs</span>
        </button>
    )
}