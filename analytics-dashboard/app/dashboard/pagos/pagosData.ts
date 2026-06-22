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
}

export const mockPagosData = {
  title: "Transacciones Financieras y Pagos",
  statusText: "Tasa de Aprobación General: 99.4% | Conectores Activos: Stripe, MercadoPago, PayPal",
  revenueAndSalesHistory: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Dinero Procesado ($)",
        data: [24000, 31000, 28000, 35000, 42000, 48500],
        color: "#4A6741", // Sage
        unit: "$"
      },
      {
        label: "Ventas Realizadas (cant.)",
        data: [180, 240, 210, 270, 310, 380],
        color: "#D97757", // Clay
        unit: "uds"
      }
    ]
  },
  transactionStates: [
    { label: "Aprobados", value: 920, colorClass: "bg-brand-sage" },
    { label: "Rechazados", value: 42, colorClass: "bg-rose-500" },
    { label: "Expirados", value: 18, colorClass: "bg-zinc-400" },
    { label: "Pendientes", value: 25, colorClass: "bg-brand-clay" }
  ],
  disputeStates: [
    { label: "Abiertas", value: 5, colorClass: "bg-rose-500" },
    { label: "En Revisión", value: 8, colorClass: "bg-brand-clay" },
    { label: "Favor Comprador", value: 24, colorClass: "bg-brand-sage" },
    { label: "Favor Vendedor", value: 19, colorClass: "bg-brand-forest" }
  ]
};
