import React from "react";

interface UserDistributionChartProps {
  sellers: number;
  buyers: number;
  carriers: number;
  operators: number;
  total: number;
}

export default function UserDistributionChart({
  sellers,
  buyers,
  carriers,
  operators,
  total,
}: UserDistributionChartProps) {
  const sellerPercentage = Math.round((sellers / total) * 100);
  const buyerPercentage = Math.round((buyers / total) * 100);
  const carrierPercentage = Math.round((carriers / total) * 100);
  const operatorPercentage = Math.round((operators / total) * 100);

  return (
    <div className="flex flex-col justify-center space-y-4 w-full">
      <div className="flex justify-between items-center px-2">
        <div>
          <h4 className="text-sm font-bold text-brand-forest">Distribución de Roles de Usuario</h4>
          <p className="text-[11px] text-zinc-400">Comparación activa entre cuentas por rol operativo</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-zinc-500 justify-end">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-sage rounded-xs"></span> Vendedores
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-clay rounded-xs"></span> Compradores
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-forest rounded-xs"></span> Carriers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-slate-500 rounded-xs"></span> Operadores
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="flex flex-col items-center space-y-3">
        <div className="h-32 w-full flex items-end justify-center gap-8 md:gap-12 border-b border-brand-sand/40 pb-1">
          
          {/* Sellers Bar */}
          <div className="flex flex-col items-center justify-end h-full">
            <span className="text-[10px] md:text-[11px] font-bold text-brand-sage mb-1">
              {sellers.toLocaleString("es-AR")}
            </span>
            <div 
              className="w-10 md:w-12 bg-brand-sage rounded-t-md transition-all duration-300 hover:opacity-85 cursor-pointer shadow-xs" 
              style={{ height: `${sellerPercentage}%` }}
            ></div>
          </div>

          {/* Buyers Bar */}
          <div className="flex flex-col items-center justify-end h-full">
            <span className="text-[10px] md:text-[11px] font-bold text-brand-clay mb-1">
              {buyers.toLocaleString("es-AR")}
            </span>
            <div 
              className="w-10 md:w-12 bg-brand-clay rounded-t-md transition-all duration-300 hover:opacity-85 cursor-pointer shadow-xs" 
              style={{ height: `${buyerPercentage}%` }}
            ></div>
          </div>

          {/* Carriers Bar */}
          <div className="flex flex-col items-center justify-end h-full">
            <span className="text-[10px] md:text-[11px] font-bold text-brand-forest mb-1">
              {carriers.toLocaleString("es-AR")}
            </span>
            <div 
              className="w-10 md:w-12 bg-brand-forest rounded-t-md transition-all duration-300 hover:opacity-85 cursor-pointer shadow-xs" 
              style={{ height: `${Math.max(carrierPercentage, 6)}%` }}
            ></div>
          </div>

          {/* Operators Bar */}
          <div className="flex flex-col items-center justify-end h-full">
            <span className="text-[10px] md:text-[11px] font-bold text-slate-500 mb-1">
              {operators.toLocaleString("es-AR")}
            </span>
            <div 
              className="w-10 md:w-12 bg-slate-500 rounded-t-md transition-all duration-300 hover:opacity-85 cursor-pointer shadow-xs" 
              style={{ height: `${Math.max(operatorPercentage, 6)}%` }}
            ></div>
          </div>

        </div>

        {/* Bar Labels */}
        <div className="flex justify-center gap-8 md:gap-12 w-full text-[10px] md:text-xs font-semibold text-brand-forest text-center">
          <span className="w-10 md:w-12">Vend. ({sellerPercentage}%)</span>
          <span className="w-10 md:w-12">Comp. ({buyerPercentage}%)</span>
          <span className="w-10 md:w-12">Carr. ({carrierPercentage}%)</span>
          <span className="w-10 md:w-12">Oper. ({operatorPercentage}%)</span>
        </div>
      </div>
    </div>
  );
}
