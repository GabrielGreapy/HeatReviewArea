

export default function Footer() {
    return (
        <div className="w-full px-8 py-space-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl items-start">
                <div className="space-y-space-xs">
                    <div className="flex items-center gap-space-xs"><span className="font-headline-sm text-headline-sm font-bold text-on-surface">ThermoTurismo</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Feito por Gabriel Martins</p>
                </div>
                <div className="space-y-space-xs">
                    <div className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                        APIS UTILIZADAS:</div>
                    <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                        <p className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                            API GooglePlaces-AutoComplete</p>
                        <p className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                            API GoogleMaps-Maps</p>
                        <p className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span> Rede
                            API Apify-GoogleMapsScraper</p>
                    </div>
                </div>
                <div className="space-y-space-xs">
                    <div className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Dê uma olhada na nossa Documentação</div>
                    
                </div>

            </div>
            <div className="mt-space-xl pt-space-md flex flex-col sm:flex-row justify-between items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
                <p>Essa aplicação foi criada no intuito de pesquisa e estudo de apis, não sou dono delas apenas a utilizo. Qualquer dado raspado não haverá nomes de ninguem para a segurança de todos.</p>
                
            </div>
        </div>
    )
}