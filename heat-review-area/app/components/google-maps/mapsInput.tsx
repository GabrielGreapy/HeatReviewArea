"use client";

import { useEffect, useRef } from "react";

declare global{
    interface Window{
        google : any
    }
}


export default function MapsInput(){

    const inputRef = useRef<HTMLInputElement>(null);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TOKEN;

    useEffect(() => {
        if(!apiKey) return;

        const initAutoComplete = () => {
            if(!inputRef.current || !window.google) return;

            const autoComplete = new window.google.maps.places.Autocomplete(
                inputRef.current, {
                    type : ["geocode"]
                }
            )
            autoComplete.addListener( "places_changed" , () => {
                const place = autoComplete.getPlace();
                if(!place || !place.geometry.location) return;
            }
            )
        }
        if(window.google){
            initAutoComplete();
            return;
        }

        const existenceScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if(existenceScript){
            existenceScript.addEventListener("load", initAutoComplete);
            return;
        }
        
        

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        document.head.appendChild(script);


    }, [])

    




    return(
        <div className="w-full max-w-3xl relative mb-5">
            <div className="p-2 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-[0_12px_36px_-6px_rgba(141,75,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 pl-4 pr-2 py-2 flex-1 w-full">
                    <span className="material-symbols-outlined text-primary text-[24px]">search</span>
                    <input
                        className="w-full bg-transparent text-on-surface placeholder:text-outline/70 focus:outline-none font-body-md text-body-md"
                        id="city-search-input"
                        placeholder="Digite o nome da cidade ou município..."
                        type="text" 
                        ref={inputRef}/>
                    <button aria-label="Limpar pesquisa"
                        className="text-outline hover:text-on-surface p-1 transition-colors hidden"
                        id="clear-search">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
                <button
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary font-label-md text-label-md font-semibold tracking-wide shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                    id="btn-analyze">
                    <span>Analisar</span>
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                </button>
            </div>
        </div>
        


    )

}