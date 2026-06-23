"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingState from "@/app/components/LoadingState";
import BarChart from "@/app/components/BarChart";
import { ComprasSectionData } from "./comprasData";

export default function ComprasPage() {
  const [data, setData] = useState<ComprasSectionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/compras").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/products/categories").then((res) => res.json()),
      fetch("/api/products/top").then((res) => res.json())
    ])
      .then(([comprasPayload, productsPayload, categoriesPayload, topProductsPayload]: [ComprasSectionData, any, any, any]) => {
        const productCount = Array.isArray(productsPayload)
          ? productsPayload.length
          : comprasPayload.totalPublishedProducts.value;

        const categoryColors: Record<string, string> = {
          "Ficción": "#2C3A27",      // Forest
          "Infantiles": "#4A6741",   // Sage
          "Historia": "#D97757",     // Clay
          "Científicos": "#A78BFA",  // Purple
          "Autoayuda": "#FBBF24",    // Yellow
          "Acción": "#3B82F6",       // Blue
        };

        const fallbackColors = [
          "#A78BFA", // Purple
          "#FBBF24", // Yellow
          "#3B82F6", // Blue
          "#EC4899", // Pink
          "#14B8A6", // Teal
          "#F97316", // Orange
          "#6B7280"  // Gray
        ];

        let colorIndex = 0;
        const categoriesData = Array.isArray(categoriesPayload)
          ? categoriesPayload.map((c: { label: string; value: number }) => ({
            label: c.label,
            value: c.value,
            color: categoryColors[c.label] || (() => {
              const col = fallbackColors[colorIndex % fallbackColors.length];
              colorIndex++;
              return col;
            })()
          }))
          : comprasPayload.categoriesData;

        const topProducts = Array.isArray(topProductsPayload)
          ? topProductsPayload
          : comprasPayload.topProducts;

        setData({
          ...comprasPayload,
          totalPublishedProducts: {
            ...comprasPayload.totalPublishedProducts,
            value: productCount
          },
          categoriesData,
          topProducts
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching compras data:", err);
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-forest">{data.title}</h1>
            </div>
          </div>
        </div>

        {/* Top metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Productos Publicados */}
          <div className="bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-6 md:col-span-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-400">Productos Publicados</span>
              <h3 className="text-4xl font-extrabold tracking-tight text-brand-forest mt-2">
                {data.totalPublishedProducts.value.toLocaleString("es-AR")}
              </h3>
            </div>
          </div>

          {/* Bar Chart: Categorías más vendidas */}
          <div className="md:col-span-2">
            <BarChart
              title="Categorías Más Vendidas"
              subtitle="Distribución de ventas por géneros literarios"
              data={data.categoriesData.map((c) => ({
                label: c.label,
                value: c.value,
                colorHex: c.color,
              }))}
            />
          </div>
        </div>

        {/* Top 5 Products Table */}
        <div className="bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-bold text-brand-forest uppercase tracking-wider">Top 5 Productos Más Vendidos</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Ranking basado en volumen de copias vendidas</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs text-zinc-600 min-w-[600px]">
              <thead>
                <tr className="bg-brand-sand/20 border-y border-brand-sand/30 text-brand-forest font-bold">
                  <th className="py-3 px-6 text-center w-12">#</th>
                  <th className="py-3 px-4">Libro</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-center">Unidades</th>
                  <th className="py-3 px-4 text-right">Recaudado</th>
                  <th className="py-3 px-6 text-center">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/20">
                {data.topProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-brand-sand/10 transition-colors duration-150">
                    <td className="py-3.5 px-6 text-center font-bold text-brand-forest text-sm">
                      {idx === 0 && <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-xs">🥇 1</span>}
                      {idx === 1 && <span className="bg-slate-100 text-slate-800 rounded-full px-2 py-0.5 text-xs">🥈 2</span>}
                      {idx === 2 && <span className="bg-orange-100 text-orange-800 rounded-full px-2 py-0.5 text-xs">🥉 3</span>}
                      {idx > 2 && <span className="text-zinc-400">{idx + 1}</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-forest">{prod.title}</td>
                    <td className="py-3.5 px-4 font-medium">{prod.author}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-brand-sand/40 text-brand-forest px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-brand-forest">{prod.sales}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-brand-forest">
                      ${prod.revenue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`font-semibold ${prod.stock < 10 ? "text-rose-600" : "text-emerald-700"}`}>
                        {prod.stock} uds
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
