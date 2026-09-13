"use client";

interface UpdateHistoryModalProps {
  cityName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function UpdateHistoryModal({
  cityName,
  onCancel,
  onConfirm,
}: UpdateHistoryModalProps) {
  return (
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-20 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 sm:p-8">
        {/* Pergunta Direta */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-2">
          Deseja atualizar o histórico da cidade?
        </h2>

        <p className="text-sm text-slate-500 text-center mb-8">
          Recalcula os quadrantes com as novas avaliações recentes
          {cityName ? ` em ${cityName}` : ""}.
        </p>

        {/* Botões Sim / Não */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 active:bg-slate-100 transition-colors text-center cursor-pointer"
          >
            Não
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-semibold text-base hover:bg-amber-700 active:bg-amber-800 transition-colors text-center shadow-sm cursor-pointer"
          >
            Sim
          </button>
        </div>
      </main>
    </div>
  );
}