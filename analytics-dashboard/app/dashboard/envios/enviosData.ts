export interface ChartBarData {
  label: string;
  value: number;
  colorClass?: string;
  colorHex?: string;
}

export interface EnviosSectionData {
  title: string;
  statusText: string;
  completionStatus: ChartBarData[];
  deliveryHistory: {
    labels: string[];
    data: number[];
  };
  shippingStates: ChartBarData[];
  stats?: {
    total: number;
    completadosCount: number;
    completadosPercent: number;
    enProcesoCount: number;
    enProcesoPercent: number;
    fallidosCount: number;
    fallidosPercent: number;
  };
}

export const mockEnviosData: EnviosSectionData = {
  title: "Logística y Despacho de Envíos",
  statusText: "Uptime de integraciones logísticas: 99.8% (Andreani, Correo Argentino, OCA)",
  completionStatus: [
    { label: "Completados", value: 685, colorClass: "bg-brand-sage" },
    { label: "En Proceso", value: 120, colorClass: "bg-brand-clay" },
    { label: "Cancelados", value: 45, colorClass: "bg-zinc-400" }
  ],
  deliveryHistory: {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    data: [65, 78, 92, 85, 110, 45, 30]
  },
  shippingStates: [
    { label: "Pendiente", value: 45, colorClass: "bg-amber-500" },
    { label: "En Sucursal", value: 80, colorClass: "bg-indigo-500" },
    { label: "En Tránsito", value: 140, colorClass: "bg-brand-clay" },
    { label: "Entregado", value: 685, colorClass: "bg-brand-sage" },
    { label: "Devuelto", value: 12, colorClass: "bg-rose-500" }
  ]
};
