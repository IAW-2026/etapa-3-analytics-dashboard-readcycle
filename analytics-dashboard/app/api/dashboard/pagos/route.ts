import { NextResponse } from "next/server";
import { PagosSectionData } from "@/app/dashboard/pagos/pagosData";

export async function GET() {
  try {
    const paymentsBaseUrl = process.env.PAYMENT_DEPLOY_PATH || "https://proyecto-c-payments-readcycle-nlqt.vercel.app/";
    const transactionsApiKey = process.env.TRANSACTIONS_API_KEY || "transactions_key_readcycle45679";
    const disputesApiKey = process.env.DISPUTES_API_KEY || "disputes_key_readcycle45679";

    const transactionsUrl = `${paymentsBaseUrl.replace(/\/$/, "")}/api/payments/transactions`;
    const disputesUrl = `${paymentsBaseUrl.replace(/\/$/, "")}/api/payments/disputes`;

    // Fetch transactions and disputes in parallel
    const [txRes, dispRes] = await Promise.all([
      fetch(transactionsUrl, {
        headers: {
          "Authorization": `Bearer ${transactionsApiKey}`
        },
        next: { revalidate: 0 }
      }),
      fetch(disputesUrl, {
        headers: {
          "Authorization": `Bearer ${disputesApiKey}`
        },
        next: { revalidate: 0 }
      })
    ]);

    if (!txRes.ok) {
      throw new Error(`Failed to fetch transactions: ${txRes.statusText}`);
    }
    if (!dispRes.ok) {
      throw new Error(`Failed to fetch disputes: ${dispRes.statusText}`);
    }

    const txData = await txRes.json();
    const dispData = await dispRes.json();

    // Support both direct arrays and objects wrapped in { data: [...] }
    const transactions = Array.isArray(txData) ? txData : (txData.data || []);
    const disputes = Array.isArray(dispData) ? dispData : (dispData.data || []);

    // 1. Calculate transaction counts and totals
    const totalTransactions = transactions.length;
    let aprobadasCount = 0;
    let rechazadasCount = 0;
    let pendientesCount = 0;
    let expiradasCount = 0;
    let totalAmount = 0;

    for (const t of transactions) {
      const status = (t.status || "").toUpperCase();
      if (status === "APPROVED") {
        aprobadasCount++;
        totalAmount += Number(t.amount) || 0;
      } else if (status === "REJECTED") {
        rechazadasCount++;
      } else if (status === "PENDING") {
        pendientesCount++;
      } else if (status === "REFUNDED" || status === "CANCELLED" || status === "EXPIRED") {
        expiradasCount++;
      } else {
        pendientesCount++;
      }
    }

    // 2. Calculate disputes by resolution stage
    let abiertasCount = 0;
    let enRevisionCount = 0;
    let favorCompradorCount = 0;
    let favorVendedorCount = 0;

    for (const d of disputes) {
      const status = (d.status || "").toUpperCase();
      if (status === "OPEN") {
        abiertasCount++;
      } else if (status === "REVIEWING") {
        enRevisionCount++;
      } else if (status === "RESOLVED") {
        favorCompradorCount++;
      } else if (status === "REJECTED") {
        favorVendedorCount++;
      } else {
        abiertasCount++;
      }
    }

    // 3. Generate dynamic 6-month historical chart data
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];
    const now = new Date();
    const labels: string[] = [];
    const monthKeys: string[] = [];
    const monthlyStats: { [key: string]: { revenue: number, sales: number } } = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${yyyy}-${mm}`;
      monthKeys.push(key);
      monthlyStats[key] = { revenue: 0, sales: 0 };
    }

    for (const t of transactions) {
      if (!t.createdAt) continue;
      const dateStr = t.createdAt.substring(0, 7); // "YYYY-MM"
      if (dateStr in monthlyStats) {
        if (t.status === "APPROVED") {
          monthlyStats[dateStr].revenue += Number(t.amount) || 0;
          monthlyStats[dateStr].sales++;
        }
      }
    }

    const revenueData = monthKeys.map(key => monthlyStats[key].revenue);
    const salesData = monthKeys.map(key => monthlyStats[key].sales);

    const aprobadasPercent = totalTransactions > 0 ? parseFloat(((aprobadasCount / totalTransactions) * 100).toFixed(1)) : 0;
    const rechazadasPercent = totalTransactions > 0 ? parseFloat(((rechazadasCount / totalTransactions) * 100).toFixed(1)) : 0;
    const pendientesPercent = totalTransactions > 0 ? parseFloat(((pendientesCount / totalTransactions) * 100).toFixed(1)) : 0;

    const data: PagosSectionData = {
      title: "Transacciones Financieras y Pagos",
      statusText: `Tasa de Aprobación General: ${aprobadasPercent}% | Conectores Activos: Stripe, MercadoPago, PayPal`,
      revenueAndSalesHistory: {
        labels: labels,
        datasets: [
          {
            label: "Dinero Procesado ($)",
            data: revenueData,
            color: "#4A6741", // Sage
            unit: "$"
          },
          {
            label: "Ventas Realizadas (cant.)",
            data: salesData,
            color: "#D97757", // Clay
            unit: "uds"
          }
        ]
      },
      transactionStates: [
        { label: "Aprobados", value: aprobadasCount, colorClass: "bg-brand-sage" },
        { label: "Rechazados", value: rechazadasCount, colorClass: "bg-rose-500" },
        { label: "Expirados", value: expiradasCount, colorClass: "bg-zinc-400" },
        { label: "Pendientes", value: pendientesCount, colorClass: "bg-brand-clay" }
      ],
      disputeStates: [
        { label: "Abiertas", value: abiertasCount, colorClass: "bg-rose-500" },
        { label: "En Revisión", value: enRevisionCount, colorClass: "bg-brand-clay" },
        { label: "Favor Comprador", value: favorCompradorCount, colorClass: "bg-brand-sage" },
        { label: "Favor Vendedor", value: favorVendedorCount, colorClass: "bg-brand-forest" }
      ],
      stats: {
        totalTransactions,
        totalAmount,
        aprobadasCount,
        aprobadasPercent,
        rechazadasCount,
        rechazadasPercent,
        pendientesCount,
        pendientesPercent,
        disputasCount: abiertasCount + enRevisionCount
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching pagos data:", error);
    return NextResponse.json({
      title: "Transacciones Financieras y Pagos",
      statusText: "Sin datos disponibles (Servicio de Pagos no disponible) | Conectores Activos: Stripe, MercadoPago, PayPal",
      revenueAndSalesHistory: {
        labels: [],
        datasets: [
          {
            label: "Dinero Procesado ($)",
            data: [],
            color: "#4A6741",
            unit: "$"
          },
          {
            label: "Ventas Realizadas (cant.)",
            data: [],
            color: "#D97757",
            unit: "uds"
          }
        ]
      },
      transactionStates: [
        { label: "Aprobados", value: 0, colorClass: "bg-brand-sage" },
        { label: "Rechazados", value: 0, colorClass: "bg-rose-500" },
        { label: "Expirados", value: 0, colorClass: "bg-zinc-400" },
        { label: "Pendientes", value: 0, colorClass: "bg-brand-clay" }
      ],
      disputeStates: [
        { label: "Abiertas", value: 0, colorClass: "bg-rose-500" },
        { label: "En Revisión", value: 0, colorClass: "bg-brand-clay" },
        { label: "Favor Comprador", value: 0, colorClass: "bg-brand-sage" },
        { label: "Favor Vendedor", value: 0, colorClass: "bg-brand-forest" }
      ],
      stats: {
        totalTransactions: 0,
        totalAmount: 0,
        aprobadasCount: 0,
        aprobadasPercent: 0,
        rechazadasCount: 0,
        rechazadasPercent: 0,
        pendientesCount: 0,
        pendientesPercent: 0,
        disputasCount: 0
      }
    });
  }
}
