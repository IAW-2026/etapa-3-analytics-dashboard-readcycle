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

