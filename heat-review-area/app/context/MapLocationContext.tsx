"use client"

import { createContext, ReactNode, useContext, useState } from "react";

interface MapLocationContextType{
    mapLocation : string | null;
    setMapLocation : (location : string) => void;
}

const MapLocationContext = createContext<MapLocationContextType | null>(null);

export function MapLocationContextProvider({ children } : { children : ReactNode}){
    const [mapLocation, setMapLocation] = useState<string | null>(null);

    return(
        <MapLocationContext.Provider value = {{ mapLocation, setMapLocation}}>
            {children}
        </MapLocationContext.Provider>
    )
}

export const useMapLocation = () => {
    const context = useContext(MapLocationContext);
    if(!context){
        throw new Error("Erro no contexto do mapa.")
    }
    return context
}