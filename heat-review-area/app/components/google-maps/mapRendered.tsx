"use client";

import { useEffect, useRef } from "react";
import { useMapLocation } from "@/app/context/MapLocationContext";
import { useInputSearch } from "@/app/context/InputSearchContext";
declare global{
    interface Window{
        google : any
    }
}

export default function Map(){
    const setMapLocation = useMapLocation();
    const { location } = useInputSearch();
    const inputSearch = useInputSearch();
    const mapRef = useRef<HTMLDivElement>(null);
    


    

    useEffect(() => {
        console.log("🔍 Verificando valores:", {location });
        if( !location) return;

        const initMap = () => {
            if(!mapRef.current || !window.google) return;
            console.log("Verificado o map ref e o window google")
            const begPosition = {
                lat : location?.lat,
                lng : location?.lng,
                

            };
            console.log("criado o begPos")
            const map = new window.google.maps.Map(
                mapRef.current, {
                    center : begPosition,
                    zoom : 18
                }
            )
            console.log("Criado o elemnto map")
        }
        if(window.google){
            console.log("if window google ativado")
            initMap();
            return;
        }
        

        
        


    }, [location])


    return(
        <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-md bg-surface-container-low select-none">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center"
            ref={mapRef}>

            </div>
        </div>
    )

}

