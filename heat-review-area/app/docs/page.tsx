"use client";

import { useState } from "react";


interface BentoCardProps {
  layer: string;
  title: string;
  description: string;
  tech: string;
  badge: string;
  icon: string;
  colorClass: {
    iconBg: string;
    text: string;
    borderHover: string;
  };
}


interface FlowStepProps {
  step: string;
  title: string;
  description: string;
  detail: string;
  icon: string;
  colorClass: string;
}

export default function Docs() {
  const [copied, setCopied] = useState(false);
  

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i @termoturismo/sdk-core");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors p-4 md:p-8 space-y-10">
      
      {/* SEÇÃO HERO (Convertida para Tailwind Padrão) */}
      <section 
        id="getting-started"
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        {/* Glow de Fundo */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        
        {/* Marca d'água °T */}
        <div className="absolute right-12 bottom-4 opacity-5 pointer-events-none select-none text-[160px] font-bold leading-none text-amber-500">
          °T
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          {/* Tags do Topo */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-xs border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Doc
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
              Módulos
            </span>

            
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-[40px] sm:leading-[48px] text-slate-900 dark:text-white tracking-tight font-extrabold max-w-3xl">
            Documentação do Projeto ThermoTurismo
          </h1>

          {/* Descrição */}
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            O ThermoTurismo é uma aplicação analítica para quem quiser utiliza-la.
            que decompõe cidades em <strong>estabelecimentos</strong> e
            converte volume de opiniões (Por meio de reviews), polaridade de sentimento e dinamismo de avaliações em um{" "}
            <strong className="text-amber-600 dark:text-amber-400">campo visual</strong>.
          </p>

          {/* Botões de Ação */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            
             

           
         

          </div>
        </div>
      </section>

      {/* SEÇÃO ARQUITETURA */}
      <main className="w-full max-w-7xl mx-auto space-y-10">
        <section className="flex flex-col gap-8" id="arquitetura">
          
          {/* Título da Seção */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">hub</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Visão Geral e Arquitetura
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Topologia de microsserviços assíncronos e orquestração do pipeline de dados
              </p>
            </div>
          </div>

          {/* Cards Bento (Grid de Arquitetura) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <BentoCard
              layer="Camada 01"
              title="Frontend Next.js (App Router)"
              description="Renderização por meio de API do Google Maps com mapa 2D. Desenhando elementos do mapa com a extensão de desenho da própria API."
              tech="TailwindCSS"
              badge="Design criado STITCH"
              icon="layers"
              colorClass={{
                iconBg: "bg-sky-500/10 text-sky-500",
                text: "text-sky-500",
                borderHover: "hover:border-sky-500/40",
              }}
            />

            <BentoCard
              layer="Camada 02"
              title="Scraping Workers e Actors"
              description="Fila gerada no Apify (Actor nwua9Gu5YrADL7ZDj). Realiza a extração de dados de lugares baseando-se no prompt do Google Maps."
              tech="Apify"
              badge="BOT ACTOR"
              icon="precision_manufacturing"
              colorClass={{
                iconBg: "bg-amber-500/10 text-amber-500",
                text: "text-amber-500",
                borderHover: "hover:border-amber-500/40",
              }}
            />

            <BentoCard
              layer="Camada Abstrata"
              title="Motivos & Interesses"
              description="A criação desta aplicação foi extremamente útil para aprendizagem no consumo de APIs. Toda a jornada está documentada."
              tech="Criativos"
              badge="10/10 Sentimentos"
              icon="psychology"
              colorClass={{
                iconBg: "bg-rose-500/10 text-rose-500",
                text: "text-rose-500",
                borderHover: "hover:border-rose-500/40",
              }}
            />

            <BentoCard
              layer="Camada 03"
              title="Banco de Dados"
              description="Implementado com Firebase Firestore pela familiaridade e agilidade de desenvolvimento, mantendo alta performance de consulta."
              tech="Firebase"
              badge="Firestore Prático"
              icon="grid_4x4"
              colorClass={{
                iconBg: "bg-indigo-500/10 text-indigo-500",
                text: "text-indigo-500",
                borderHover: "hover:border-indigo-500/40",
              }}
            />
          </div>

          {/* Diagrama de Fluxo Sequencial */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">alt_route</span>
                Fluxo Sequencial Resumido
              </h3>
              <span className="self-start sm:self-auto text-[11px] font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                Pipeline Assíncrono
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FlowStep
                step="01. DISPARO"
                title="Busca Inicial"
                description="Verifica no banco de dados se a cidade selecionada já possui análise cadastrada."
                detail="Ativado na ausência de dados ou ao solicitar reanálise da região."
                icon="schedule"
                colorClass="text-sky-500 hover:border-sky-500/40"
              />

              <FlowStep
                step="02. ATORES"
                title="Coleta & Armazenamento"
                description="Extrai dados dos estabelecimentos e persiste as informações atualizadas no Firestore."
                detail="Alimenta o mapa com dados estruturados dos locais."
                icon="cloud_sync"
                colorClass="text-amber-500 hover:border-amber-500/40"
              />

              <FlowStep
                step="03. DRAW"
                title="Renderização Visual"
                description="Desenha dinamicamente as regiões e marcadores no mapa interativo."
                detail="Fornece feedback térmico e visual instantâneo para o usuário."
                icon="model_training"
                colorClass="text-rose-500 hover:border-rose-500/40"
              />

              <FlowStep
                step="04. ENTREGA"
                title="Experiência do Usuário"
                description="Apresentação clara dos locais com melhores e piores avaliações."
                detail="Permite tomadas de decisão ágeis com base nos dados do campo térmico."
                icon="grain"
                colorClass="text-indigo-500 hover:border-indigo-500/40"
              />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

// Subcomponente Auxiliar: Cards do Bento Grid
function BentoCard({ layer, title, description, tech, badge, icon, colorClass }: BentoCardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between ${colorClass.borderHover} transition-all duration-300 group`}>
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl ${colorClass.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-bold ${colorClass.text}`}>
          {layer}
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>{tech}</span>
        <span className={`${colorClass.text} font-semibold`}>{badge}</span>
      </div>
    </div>
  );
}

// Subcomponente Auxiliar: Passos do Fluxo
function FlowStep({ step, title, description, detail, icon, colorClass }: FlowStepProps) {
  return (
    <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-2.5 transition-all duration-200 ${colorClass}`}>
      <span className="text-[10px] font-bold tracking-wider opacity-90">{step}</span>
      <span className="material-symbols-outlined text-[26px]">{icon}</span>
      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{title}</span>
      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
        {description}
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight border-t border-slate-200 dark:border-slate-800 pt-2 w-full">
        {detail}
      </p>
    </div>
  );
}