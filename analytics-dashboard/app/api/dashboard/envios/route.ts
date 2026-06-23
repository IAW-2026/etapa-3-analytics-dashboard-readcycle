import { NextResponse } from "next/server";
import { EnviosSectionData } from "@/app/dashboard/envios/enviosData";

export async function GET() {
  try {
    const url = "https://proyecto-c-shipping-readcycle.vercel.app/api/shipments/";
    const apiKey = process.env.SHIPPING_DIRECT_KEY || process.env.SHIPPING_API_KEY || "apitoken_readcycle_2026";

    const res = await fetch(url, {
      headers: {
        "x-api-key": apiKey
      },
      next: { revalidate: 0 } // No cache for fresh statistics
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch shipments: ${res.status} ${res.statusText}`);
    }

    const shipments = await res.json() as any[];

    // Calculate total count
    const total = shipments.length;

    // Initialize counters
    let completadosCount = 0;
    let enProcesoCount = 0;
    let fallidosCount = 0;

    let pendienteCount = 0;
    let enSucursalCount = 0;
    let enTransitoCount = 0;
    let entregadoCount = 0;
    let devueltoCount = 0;

    // Loop through shipments to count statuses
    for (const s of shipments) {
      const status = (s.currentStatus || "").toUpperCase();

      // completionStatus categories: Completados vs En Proceso vs Cancelados
      if (status === "DELIVERED" || status === "COMPLETED") {
        completadosCount++;
      } else if (status === "FAILED" || status === "CANCELLED" || status === "DEVUELTO" || status === "RETURNED") {
        fallidosCount++;
      } else {
        // PENDING, PICKED_UP, IN_TRANSIT, IN_BRANCH, etc.
        enProcesoCount++;
      }

      // shippingStates categories: Pendiente, En Sucursal, En Tránsito, Entregado, Devuelto
      if (status === "PENDING") {
        pendienteCount++;
      } else if (status === "IN_BRANCH" || status === "SUCURSAL" || status === "EN_SUCURSAL" || status === "READY_FOR_PICKUP") {
        enSucursalCount++;
      } else if (status === "PICKED_UP" || status === "IN_TRANSIT") {
        enTransitoCount++;
      } else if (status === "DELIVERED" || status === "COMPLETED") {
        entregadoCount++;
      } else if (status === "FAILED" || status === "CANCELLED" || status === "DEVUELTO" || status === "RETURNED") {
        devueltoCount++;
      } else {
        // Fallback for unexpected statuses
        pendienteCount++;
      }
    }

    // Build the delivery history (last 7 days ending today)
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const now = new Date();
    const labels: string[] = [];
    const dayKeys: string[] = [];
    const dailyCounts: { [key: string]: number } = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(daysOfWeek[d.getDay()]);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;
      dayKeys.push(dateKey);
      dailyCounts[dateKey] = 0;
    }

    for (const s of shipments) {
      if (!s.createdAt) continue;
      const dateStr = s.createdAt.substring(0, 10);
      if (dateStr in dailyCounts) {
        dailyCounts[dateStr]++;
      }
    }

    const historyData = dayKeys.map(key => dailyCounts[key]);

    const data: EnviosSectionData = {
      title: "Logística y Despacho de Envíos",
      statusText: `Total de envíos registrados: ${total}. Uptime logístico: 99.8%.`,
      completionStatus: [
        { label: "Completados", value: completadosCount, colorClass: "bg-brand-sage" },
        { label: "En Proceso", value: enProcesoCount, colorClass: "bg-brand-clay" },
        { label: "Cancelados", value: fallidosCount, colorClass: "bg-zinc-400" }
      ],
      deliveryHistory: {
        labels: labels,
        data: historyData
      },
      shippingStates: [
        { label: "Pendiente", value: pendienteCount, colorClass: "bg-amber-500" },
        { label: "En Sucursal", value: enSucursalCount, colorClass: "bg-indigo-500" },
        { label: "En Tránsito", value: enTransitoCount, colorClass: "bg-brand-clay" },
        { label: "Entregado", value: entregadoCount, colorClass: "bg-brand-sage" },
        { label: "Devuelto", value: devueltoCount, colorClass: "bg-rose-500" }
      ],
      stats: {
        total,
        completadosCount,
        completadosPercent: total > 0 ? parseFloat(((completadosCount / total) * 100).toFixed(1)) : 0,
        enProcesoCount,
        enProcesoPercent: total > 0 ? parseFloat(((enProcesoCount / total) * 100).toFixed(1)) : 0,
        fallidosCount,
        fallidosPercent: total > 0 ? parseFloat(((fallidosCount / total) * 100).toFixed(1)) : 0,
      }
    };

    console.log("=== ENVIOS DATA RETURNED ===");
    console.log(JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching shipping data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
