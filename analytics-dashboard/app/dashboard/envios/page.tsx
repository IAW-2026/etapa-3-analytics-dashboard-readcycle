"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingState from "@/app/components/LoadingState";
import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
import MetricCard from "@/app/components/MetricCard";
import { EnviosSectionData } from "./enviosData";

export default function EnviosPage() {
  const [data, setData] = useState<EnviosSectionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/dashboard/envios")
      .then((res) => res.json())
      .then((payload: EnviosSectionData) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching envios data:", err);
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
              title="Total Envíos"
              metric={data.stats.total.toLocaleString("es-AR")}
              description="Registrados en la plataforma"
              iconColorClass="text-brand-forest"
              iconBgColorClass="bg-brand-forest/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />
            <MetricCard
              title="Envíos Completados"
              metric={`${data.stats.completadosPercent}%`}
              description={`${data.stats.completadosCount} entregados`}
              iconColorClass="text-brand-sage"
              iconBgColorClass="bg-brand-sage/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            />
            <MetricCard
              title="En Proceso"
              metric={`${data.stats.enProcesoPercent}%`}
              description={`${data.stats.enProcesoCount} en sucursal o tránsito`}
              iconColorClass="text-brand-clay"
              iconBgColorClass="bg-brand-clay/10"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Cancelados / Fallidos"
              metric={`${data.stats.fallidosPercent}%`}
              description={`${data.stats.fallidosCount} envíos fallidos`}
              iconColorClass="text-rose-500"
              iconBgColorClass="bg-rose-500/10"
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
          
          {/* Bar Chart: Pedidos Completados vs En Proceso */}
          <div className="flex flex-col">
            <BarChart
              title="Resumen Operativo de Pedidos"
              subtitle="Estado de procesamiento de órdenes totales"
              data={data.completionStatus}
            />
          </div>

          {/* Bar Chart: Estados de envíos */}
          <div className="flex flex-col">
            <BarChart
              title="Estados Detallados del Courier"
              subtitle="Etapa actual de distribución física"
              data={data.shippingStates}
            />
          </div>

          {/* Line Chart: Cantidad de entregas por tiempo (1 Line) */}
          <div className="md:col-span-2 flex flex-col">
            <LineChart
              title="Histórico Diario de Entregas"
              subtitle="Entregas completadas por día en la última semana"
              labels={data.deliveryHistory.labels}
              datasets={[
                {
                  label: "Entregas Realizadas",
                  data: data.deliveryHistory.data,
                  color: "#4A6741", // Sage
                  unit: "uds"
                }
              ]}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
