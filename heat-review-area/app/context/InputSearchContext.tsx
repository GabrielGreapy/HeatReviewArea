"use client";


import { createContext, ReactNode, useContext, useState } from "react";

export interface SearchLocalization {
    address : string;
    lat : number;
    lng : number;
    bounds: { north: number; south: number; east: number; west: number } | null;
}

interface InputSearchContextType {
    location : SearchLocalization | null;
    setLocation : (location:SearchLocalization) => void ;
}

const InputSearchContext = createContext<InputSearchContextType | null>(null);


export function InputSearchProvider({children} : {children : ReactNode}){
    const [location, setLocation] = useState< SearchLocalization | null>(null);

    return(
        <InputSearchContext.Provider value = {{location , setLocation}}>
            { children }
        </InputSearchContext.Provider>
    )
}

export const useInputSearch = () => {
    const context = useContext(InputSearchContext);
    if(!context){
        throw new Error("Erro na constante userInput");
    }
    return context

}