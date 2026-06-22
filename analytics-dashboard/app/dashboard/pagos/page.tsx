"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingState from "@/app/components/LoadingState";
import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import { PagosSectionData } from "./pagosData";

export default function PagosPage() {
  const [data, setData] = useState<PagosSectionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/dashboard/pagos")
      .then((res) => res.json())
      .then((payload: PagosSectionData) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pagos data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col flex-1 bg-brand-beige/30 p-4 md:p-8 select-none animate-fade-in">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Back Button & Header */}
        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-forest hover:text-brand-sage transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Panel General
          </Link>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-forest">{data.title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{data.statusText}</p>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dual Line Chart: Dinero procesado y Ventas por tiempo */}
          <div className="md:col-span-2 flex flex-col">
            <LineChart
              title="Historial de Ventas y Facturación"
              subtitle="Evolución semestral de ingresos ($) y unidades transaccionadas (uds)"
              labels={data.revenueAndSalesHistory.labels}
              datasets={data.revenueAndSalesHistory.datasets}
            />
          </div>

          {/* Bar Chart: Estado de Transacciones */}
          <div className="flex flex-col">
            <BarChart
              title="Estados de Transacciones"
              subtitle="Desglose de operaciones financieras procesadas"
              data={data.transactionStates}
            />
          </div>

          {/* Bar Chart: Estado de Disputas */}
          <div className="flex flex-col">
            <BarChart
              title="Gestión de Disputas y Reclamos"
              subtitle="Estado de mediación de disputas registradas"
              data={data.disputeStates}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
