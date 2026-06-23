import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    let total = 0;
    let sellers = 0;
    let buyers = 0;
    let carriers = 0;
    let operators = 0;
    let admins = 0;

    // Fetch users from Clerk
    try {
      const client = await clerkClient();
      const limit = 500;
      let offset = 0;

      while (true) {
        const response = await client.users.getUserList({
          limit,
          offset,
        });

        const users = response.data;
        if (!users || users.length === 0) {
          break;
        }

        for (const user of users) {
          total++;
          const publicMetadata = user.publicMetadata as { roles?: string | string[] } | undefined;
          const roles = publicMetadata?.roles;

          if (roles) {
            const rolesList = Array.isArray(roles) ? roles : [roles];

            let isSeller = false;
            let isBuyer = false;
            let isCarrier = false;
            let isOperator = false;
            let isAdmin = false;

            for (const role of rolesList) {
              if (typeof role !== 'string') continue;
              const r = role.toUpperCase();
              if (r === "SELLER") {
                isSeller = true;
              } else if (r === "BUYER") {
                isBuyer = true;
              } else if (r === "CARRIER") {
                isCarrier = true;
              } else if (r === "OPERATOR") {
                isOperator = true;
              } else if (r === "ADMIN") {
                isAdmin = true;
              }
            }

            if (isSeller) sellers++;
            if (isBuyer) buyers++;
            if (isCarrier) carriers++;
            if (isOperator) operators++;
            if (isAdmin) admins++;
          }
        }

        if (users.length < limit) {
          break;
        }
        offset += limit;
      }
    } catch (err) {
      console.error("Error fetching users from Clerk:", err);
    }

    // Fetch transactions from the payments service
    let totalAmountMoved = 0;
    let pagosMetric = "";
    let pagosStatusText = "";
    let pagosItems: any[] = [];

    try {
      const paymentsBaseUrl = process.env.PAYMENT_DEPLOY_PATH || "https://proyecto-c-payments-readcycle-nlqt.vercel.app/";
      const paymentsApiKey = process.env.TRANSACTIONS_API_KEY || "transactions_key_readcycle45679";
      const paymentsUrl = `${paymentsBaseUrl.replace(/\/$/, "")}/api/payments/transactions`;

      const txResponse = await fetch(paymentsUrl, {
        headers: {
          "Authorization": `Bearer ${paymentsApiKey}`
        }
      });

      if (txResponse.ok) {
        const transactions = await txResponse.json() as Array<{
          id: string;
          orderId: string;
          amount: string;
          status: string;
          paymentMethod: string;
          createdAt: string;
        }>;

        const totalTransactions = transactions.length;
        let aprobadasCount = 0;
        let rechazadasCount = 0;
        let pendientesCount = 0;

        for (const tx of transactions) {
          const status = (tx.status || "").toUpperCase();
          if (status === "APPROVED") {
            totalAmountMoved += Number(tx.amount) || 0;
            aprobadasCount++;
          } else if (status === "REJECTED") {
            rechazadasCount++;
          } else {
            pendientesCount++;
          }
        }

        const aprobadasPercent = totalTransactions > 0 ? parseFloat(((aprobadasCount / totalTransactions) * 100).toFixed(1)) : 0;
        pagosMetric = `${aprobadasPercent}%`;
        pagosStatusText = `Aprobadas: ${aprobadasCount} | Rechazadas: ${rechazadasCount} | Pendientes: ${pendientesCount}`;

        const sortedTransactions = [...transactions].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        pagosItems = sortedTransactions.slice(0, 4).map((t) => {
          const status = (t.status || "").toUpperCase();
          let statusStyle = "bg-amber-100 text-amber-800";
          let statusEsp = "Pendiente";
          if (status === "APPROVED") {
            statusStyle = "bg-emerald-100 text-emerald-800";
            statusEsp = "Aprobado";
          } else if (status === "REJECTED") {
            statusStyle = "bg-rose-100 text-rose-800";
            statusEsp = "Rechazado";
          }

          return {
            id: `PAG-${t.id.substring(3, 7).toUpperCase()}`,
            label: `Orden #${t.orderId || "S/D"}`,
            subLabel: `Método: ${t.paymentMethod || "S/D"}`,
            value: `$${(Number(t.amount) || 0).toLocaleString("es-AR")}`,
            status: statusEsp,
            statusStyle,
          };
        });
      } else {
        console.error(`Failed to fetch transactions from payments API: ${txResponse.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching payments for main dashboard overview:", err);
    }

    // Fetch shipments from the shipping service
    let enviosMetric = "";
    let enviosStatusText = "";
    let enviosItems: any[] = [];

    try {
      const shippingBaseUrl = "https://proyecto-c-shipping-readcycle.vercel.app/";
      const shippingApiKey = process.env.SHIPPING_DIRECT_KEY || process.env.SHIPPING_API_KEY || "apitoken_readcycle_2026";
      const shippingUrl = `${shippingBaseUrl.replace(/\/$/, "")}/api/shipments/`;

      const shipResponse = await fetch(shippingUrl, {
        headers: {
          "x-api-key": shippingApiKey
        },
        next: { revalidate: 0 }
      });

      if (shipResponse.ok) {
        const shipments = await shipResponse.json() as any[];
        enviosMetric = shipments.length.toLocaleString("es-AR");
        
        let pending = 0;
        let failed = 0;
        let delivered = 0;
        let inTransit = 0;

        for (const s of shipments) {
          const status = (s.currentStatus || "").toUpperCase();
          if (status === "PENDING") {
            pending++;
          } else if (status === "PICKED_UP" || status === "IN_TRANSIT") {
            inTransit++;
          } else if (status === "FAILED" || status === "CANCELLED" || status === "RETURNED" || status === "DEVUELTO") {
            failed++;
          } else if (status === "DELIVERED" || status === "COMPLETED") {
            delivered++;
          } else {
            pending++;
          }
        }

        enviosStatusText = `En tránsito: ${inTransit} | Entregados: ${delivered} | Pendientes: ${pending} | Fallidos: ${failed}`;

        const sortedShipments = [...shipments].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        enviosItems = sortedShipments.slice(0, 4).map((s) => {
          const status = (s.currentStatus || "").toUpperCase();
          let statusStyle = "bg-amber-100 text-amber-800";
          let statusEsp = "Pendiente";
          
          if (status === "PICKED_UP" || status === "IN_TRANSIT") {
            statusStyle = "bg-blue-100 text-blue-800";
            statusEsp = "En Tránsito";
          } else if (status === "DELIVERED" || status === "COMPLETED") {
            statusStyle = "bg-emerald-100 text-emerald-800";
            statusEsp = "Entregado";
          } else if (status === "FAILED" || status === "CANCELLED" || status === "RETURNED" || status === "DEVUELTO") {
            statusStyle = "bg-rose-100 text-rose-800";
            statusEsp = "Fallido";
          }

          return {
            id: `ENV-${s.id.substring(3, 7).toUpperCase()}`,
            label: `Orden #${s.orderId || "S/D"}`,
            subLabel: `ID Envío: ${s.id.substring(0, 8)}...`,
            value: s.createdAt ? new Date(s.createdAt).toLocaleDateString("es-AR") : "S/D",
            status: statusEsp,
            statusStyle,
          };
        });
      } else {
        console.error(`Failed to fetch shipments: ${shipResponse.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching shipments for main dashboard overview:", err);
    }

    const dashboardData = {
      registeredUsers: {
        total,
        sellers,
        buyers,
        carriers,
        operators,
        admins,
      },
      totalAmountMoved,
      sections: {
        datos: {
          title: "Datos Generales del Sistema",
          metric: "",
          metricLabel: "",
          statusText: "",
          items: []
        },
        compras: {
          title: "Métricas de Compras y Órdenes",
          metric: "0",
          metricLabel: "Órdenes Registradas",
          statusText: "",
          items: []
        },
        envios: {
          title: "Logística y Despacho de Envíos",
          metric: enviosMetric,
          metricLabel: "Envíos Totales Procesados",
          statusText: enviosStatusText,
          items: enviosItems,
        },
        pagos: {
          title: "Transacciones Financieras y Pagos",
          metric: pagosMetric,
          metricLabel: "Tasa de Éxito de Transacciones",
          statusText: pagosStatusText,
          items: pagosItems,
        }
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Critical error in dashboard GET API route:", error);
    // If anything fails critically, return a valid blank DashboardData structure to keep frontend working
    return NextResponse.json({
      registeredUsers: { total: 0, sellers: 0, buyers: 0, carriers: 0, operators: 0, admins: 0 },
      totalAmountMoved: 0,
      sections: {
        datos: { title: "Datos Generales del Sistema", metric: "", metricLabel: "", statusText: "", items: [] },
        compras: { title: "Métricas de Compras y Órdenes", metric: "0", metricLabel: "Órdenes Registradas", statusText: "", items: [] },
        envios: { title: "Logística y Despacho de Envíos", metric: "", metricLabel: "Envíos Totales Procesados", statusText: "", items: [] },
        pagos: { title: "Transacciones Financieras y Pagos", metric: "", metricLabel: "Tasa de Éxito de Transacciones", statusText: "", items: [] }
      }
    });
  }
}
