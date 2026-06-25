import React from "react";

interface BarItem {
  label: string;
  value: number;
  colorClass?: string;
  colorHex?: string;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: BarItem[];
  valueFormatter?: (val: number) => string;
  noFrame?: boolean;
}

export default function BarChart({
  title,
  subtitle,
  data,
  valueFormatter = (val) => val.toLocaleString("es-AR"),
  noFrame = false,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className={noFrame ? "flex flex-col w-full justify-between" : "bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-6 flex flex-col w-full h-full justify-between"}>
      <div className="flex flex-col mb-6">
        <h4 className="text-sm font-bold text-brand-forest uppercase tracking-wider">{title}</h4>
        {subtitle && <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Bar Chart Container */}
      <div className="w-full flex flex-col justify-end">
        {/* Fixed height container for bars so percentage heights resolve correctly */}
        <div className="h-40 w-full flex items-end justify-between gap-3 border-b border-brand-sand/40 pb-2 px-2">
          {data.map((item, idx) => {
            const percentage = Math.round((item.value / total) * 100) || 0;
            const barHeightPercentage = (item.value / maxValue) * 100;
            const finalHeight = Math.max(barHeightPercentage, 5); // Minimum 5% to show a small bar
            
            const bgClass = item.colorHex ? "" : (item.colorClass || "bg-brand-sage");
            const bgStyle = item.colorHex ? { backgroundColor: item.colorHex } : undefined;

            return (
              <div key={idx} className="h-full flex flex-col justify-end items-center flex-1 group relative">
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 transition-all duration-200">
                  <div className="bg-brand-forest text-brand-beige text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                    {valueFormatter(item.value)} ({percentage}%)
                  </div>
                  <div className="w-1.5 h-1.5 bg-brand-forest rotate-45 -mt-1"></div>
                </div>

                {/* The Bar */}
                <div
                  style={{ height: `${finalHeight}%`, ...bgStyle }}
                  className={`w-full max-w-[48px] ${bgClass} rounded-t-md transition-all duration-300 hover:brightness-95 hover:scale-x-[1.03] cursor-pointer shadow-xs`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Labels below the axis */}
        <div className="flex justify-between gap-3 mt-3 px-2 text-[10px] md:text-xs font-semibold text-brand-forest text-center">
          {data.map((item, idx) => (
            <span key={idx} className="flex-1 truncate text-ellipsis" title={item.label}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
