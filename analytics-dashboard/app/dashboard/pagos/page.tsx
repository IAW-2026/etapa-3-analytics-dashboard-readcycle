"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingState from "@/app/components/LoadingState";
import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import MetricCard from "@/app/components/MetricCard";
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

        {/* Metric Cards Row */}
        {data.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Total Procesado"
              metric={`$${data.stats.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
              description="Volumen transaccionado aprobado"
              iconColorClass="text-brand-forest"
              iconBgColorClass="bg-brand-forest/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Tasa de Aprobación"
              metric={`${data.stats.aprobadasPercent}%`}
              description={`${data.stats.aprobadasCount} de ${data.stats.totalTransactions} transacciones`}
              iconColorClass="text-brand-sage"
              iconBgColorClass="bg-brand-sage/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Transacciones Rechazadas"
              metric={`${data.stats.rechazadasPercent}%`}
              description={`${data.stats.rechazadasCount} transacciones fallidas`}
              iconColorClass="text-rose-500"
              iconBgColorClass="bg-rose-500/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Disputas Activas"
              metric={data.stats.disputasCount.toLocaleString("es-AR")}
              description="Reclamos abiertos o en revisión"
              iconColorClass="text-brand-clay"
              iconBgColorClass="bg-brand-clay/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
          </div>
        )}

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
