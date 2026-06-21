import React from "react";

interface MetricCardProps {
  title: string;
  metric: string;
  description: string;
  icon: React.ReactNode;
  iconColorClass?: string;
  iconBgColorClass?: string;
}

export default function MetricCard({
  title,
  metric,
  description,
  icon,
  iconColorClass = "text-brand-sage",
  iconBgColorClass = "bg-brand-sage/10",
}: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl border bg-white/80 border-brand-sand/50 hover:bg-white hover:border-brand-sage/40 transition-all duration-200 shadow-xs">
      <div className="flex justify-between items-start">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</span>
        <span className={`p-1 rounded-lg ${iconBgColorClass} ${iconColorClass}`}>
          {icon}
        </span>
      </div>
      <div className="mt-2.5">
        <h3 className="text-lg md:text-xl font-extrabold text-brand-forest">{metric}</h3>
        <p className="text-[10px] text-zinc-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
