import { ChartBarData } from "../envios/enviosData";

export interface LineDataset {
  label: string;
  data: number[];
  color: string;
  unit: string;
}

export interface PagosSectionData {
  title: string;
  statusText: string;
  revenueAndSalesHistory: {
    labels: string[];
    datasets: LineDataset[];
  };
  transactionStates: ChartBarData[];
  disputeStates: ChartBarData[];
  stats?: {
    totalTransactions: number;
    totalAmount: number;
    aprobadasCount: number;
    aprobadasPercent: number;
    rechazadasCount: number;
    rechazadasPercent: number;
    pendientesCount: number;
    pendientesPercent: number;
    disputasCount: number;
  };
}

