"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/app/components/LoadingState";
import MetricCard from "@/app/components/MetricCard";
import BarChart from "@/app/components/BarChart";
import { DashboardData } from "./data";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((payload: DashboardData) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col flex-1 bg-brand-beige/30 p-4 md:p-8 select-none animate-fade-in">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-forest">Panel General de Administración</h1>
            <p className="text-xs md:text-sm text-zinc-500 mt-0.5">Control de métricas clave, usuarios y secciones operativas de ReadCycle.</p>
          </div>
        </div>

        {/* 1. Large Panel (Panel Grande) */}
        <div className="bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-6 md:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6">Métricas Principales de la Plataforma</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Section: Key Stats (Registered Users & Amount Moved) */}
            <div className="md:col-span-1 space-y-8 border-b md:border-b-0 md:border-r border-brand-sand/40 pb-6 md:pb-0 md:pr-8">
              
              {/* Stat 1: Registered Users */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-brand-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Usuarios Registrados
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-extrabold tracking-tight text-brand-forest">
                    {data.registeredUsers.total.toLocaleString("es-AR")}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">+6.4%</span>
                </div>
                <p className="text-[11px] text-zinc-400">Total acumulado de cuentas activas en el portal.</p>
              </div>

              {/* Stat 2: Total Amount Moved */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-brand-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Monto Total Transaccionado
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-extrabold tracking-tight text-brand-forest">
                    ${data.totalAmountMoved.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">+12.8%</span>
                </div>
                <p className="text-[11px] text-zinc-400">Volumen financiero total movilizado a la fecha.</p>
              </div>

            </div>

            {/* Right Section: Buyers vs Sellers vs Carriers vs Operators Bar Chart (Decoupled component) */}
            <div className="md:col-span-2">
              <BarChart
                title="Distribución de Roles de Usuario"
                subtitle="Comparación activa entre cuentas por rol operativo"
                noFrame
                data={[
                  { label: "Vendedores", value: data.registeredUsers.sellers, colorClass: "bg-brand-sage" },
                  { label: "Compradores", value: data.registeredUsers.buyers, colorClass: "bg-brand-clay" },
                  { label: "Carriers", value: data.registeredUsers.carriers, colorClass: "bg-brand-forest" },
                  { label: "Operadores", value: data.registeredUsers.operators, colorClass: "bg-zinc-500" },
                ]}
              />
            </div>

          </div>
        </div>

        {/* 2. Three Small Panels for Navigation (Metric Cards components) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card: Compras */}
          <MetricCard
            title="Compras"
            metric={data.sections.compras.metric}
            description="Órdenes Realizadas"
            iconColorClass="text-brand-clay"
            iconBgColorClass="bg-brand-clay/10"
            href="/dashboard/compras"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9H14l1 12H4L5 9z" />
              </svg>
            }
          />

          {/* Card: Envíos */}
          <MetricCard
            title="Envíos"
            metric={data.sections.envios.metric}
            description="Envíos Gestionados"
            iconColorClass="text-brand-sage"
            iconBgColorClass="bg-brand-sage/10"
            href="/dashboard/envios"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            }
          />

          {/* Card: Pagos */}
          <MetricCard
            title="Pagos"
            metric={data.sections.pagos.metric}
            description="Transacciones Exitosas"
            iconColorClass="text-brand-clay"
            iconBgColorClass="bg-brand-clay/10"
            href="/dashboard/pagos"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
          />

        </div>

      </div>
    </div>
  );
}
