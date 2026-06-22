"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingState from "@/app/components/LoadingState";
import BarChart from "@/app/components/BarChart";
import LineChart from "@/app/components/LineChart";
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
