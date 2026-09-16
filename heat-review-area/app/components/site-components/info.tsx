export default function Info() {
    return (
        <div className="grid grid-cols-1 gap-6 w-full text-left md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group flex flex-col justify-between rounded-2xl bg-surface-container-lowest/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md">
                            <div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary transition-transform group-hover:scale-105">
                                    <span className="material-symbols-outlined text-[26px]">satellite_alt</span>
                                </div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Detecção de estabelecimento</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">APIFY
                                        </span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm mb-2 font-bold text-on-surface">Automatizado</h3>
                                <p className="font-body-md text-body-md mb-6 leading-relaxed text-on-surface-variant">
                                    Estabelecimentos limitados apenas a região da cidade selecionada na barra de pesquisa.
                                </p>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3.5">
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Teremos um limites pois estamos usando meus tokens e sou estudante...</span>
                                    
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-secondary">
                                    <span className="material-symbols-outlined text-[20px]">tune</span>
                                </div>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-[26px]">layers</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Banco de Dados</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Firebase</span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                                    Pesquisas já feitas serão guardadas
                                    </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                                    Você pode visualizar cidades que já foram analisadas em "Analises já feitas".
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Até agora se os tokens forem suficientes você pode fazer pesquisas até eles acabar.</span>
                                   
                                </div>
                                <span className="material-symbols-outlined text-secondary text-[20px]">zoom_in_map</span>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container mb-4 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-[26px]">analytics</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Mapa interativo</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">GoogleMaps
                                        </span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Dados de mapas da API da biblioteca do Google Maps</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                                    Com opção de ver a visão satelite.
                                </p>
                            </div>
                            
                            <div className="p-3.5 rounded-xl bg-surface-container-low space-y-1.5">
                                <div className="flex justify-between text-label-sm font-label-sm font-medium text-on-surface-variant">
                                    <span>Uma opção de AutoComplete na barra de pesquisa tambem foi implementada.</span>
                                    
                                </div>
                                <div className="h-2 w-full rounded-full bg-gradient-to-r from-secondary via-secondary-fixed-dim via-primary-fixed-dim to-tertiary">
                                </div>
                            </div>
                        </div>
                    </div>
    );
}