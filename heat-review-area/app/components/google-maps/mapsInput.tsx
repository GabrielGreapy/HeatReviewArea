"use client";

import { useEffect, useRef } from "react";
import {SearchLocalization , useInputSearch } from "@/app/context/InputSearchContext";
import { useRouter } from "next/navigation";
declare global{
    interface Window{
        google : any
    }
}


export default function MapsInput(){
    const { setLocation } = useInputSearch();
    
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null);

    

    const handleLocationSelect = (data:SearchLocalization) => {
        setLocation(data);

        const params = new URLSearchParams({
            lat: data.lat.toString(),
            lng: data.lng.toString(),
            q: data.address,
        })
        router.push(`/?${params.toString()}`)
    }
    const doSearch = (searchTerm : string) => {
        if(searchTerm.trim() == "") return;
        router.push(`/?q=${encodeURIComponent(searchTerm)}`);
        

    }



    useEffect(() => {
        

        const initAutoComplete = () => {
            if(!inputRef.current || !window.google) return;

            const autoComplete = new window.google.maps.places.Autocomplete(
                inputRef.current, {
                    types : ["(cities)"],
                    fields : ["formatted_address" ,  "geometry", "name"]
                }
            )
            autoComplete.addListener( "place_changed" , () => {
                const place = autoComplete.getPlace();
                if(!place?.geometry?.location) return;
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address||place.name|| "";
                const vp = place.geometry.viewport;
                const bounds = {
                    north: vp.getNorthEast().lat(),
                    east: vp.getNorthEast().lng(),
                    south: vp.getSouthWest().lat(),
                    west: vp.getSouthWest().lng(),
                }
                handleLocationSelect({lat, lng, address, bounds});

            }
            )
        }
        if(window.google){
            initAutoComplete();
            return;
        }

        
        
        

       

        


    }, [])

    
    const handleButtonClick = () => {
        const value = inputRef.current?.value || "";
        doSearch(value);
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key == "Enter"){
            const value = inputRef.current?.value || "";
            doSearch(value);
        }
    }



    return(
        <div className="w-full max-w-3xl relative mb-5">
            <div className="p-2 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-[0_12px_36px_-6px_rgba(141,75,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 pl-4 pr-2 py-2 flex-1 w-full">
                    
                    <input
                        className="w-full bg-transparent text-on-surface placeholder:text-outline/70 focus:outline-none font-body-md text-body-md"
                        id="city-search-input"
                        placeholder="Digite o nome da cidade ou município..."
                        type="text" 
                        ref={inputRef}
                        onKeyDown={handleKeyDown}/>
                    <button aria-label="Limpar pesquisa"
                        className="text-outline hover:text-on-surface p-1 transition-colors hidden"
                        id="clear-search"
                        >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
                <button
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary font-label-md text-label-md font-semibold tracking-wide shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                    id="btn-analyze"
                    onClick={handleButtonClick}>
                    <span>Analisar</span>
                    <span className="material-symbols-outlined text-primary text-[24px]">search</span>
                </button>
            </div>
        </div>
        


    )

}