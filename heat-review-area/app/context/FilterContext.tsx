"use client";

import { createContext, ReactNode, useContext, useState } from "react";


export interface FilterContextType{
    filteringBy : string;
    setFilteringBy : (value: string) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterContextProvider({children} : {children : ReactNode}){
    const [filteringBy,setFilteringBy] = useState<string>("streets");
    return(
        <FilterContext.Provider value={{filteringBy, setFilteringBy}}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if(!context){
        throw new Error("Erro no context do Filter");
    }
    return context;
}