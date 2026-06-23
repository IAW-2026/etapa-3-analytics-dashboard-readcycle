import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { mockDashboardData } from "@/app/dashboard/data";

export async function GET() {
  try {
    const client = await clerkClient();

    const limit = 500;
    let offset = 0;
    let total = 0;
    let sellers = 0;
    let buyers = 0;
    let carriers = 0;
    let operators = 0;
    let admins = 0;

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

    // Fetch transactions from the payments service to calculate the total amount moved
    const paymentsBaseUrl = process.env.PAYMENT_DEPLOY_PATH || "https://proyecto-c-payments-readcycle-nlqt.vercel.app/";
    const paymentsApiKey = process.env.TRANSACTIONS_API_KEY || "transactions_key_readcycle45679";
    const paymentsUrl = `${paymentsBaseUrl.replace(/\/$/, "")}/api/payments/transactions`;

    const txResponse = await fetch(paymentsUrl, {
      headers: {
        "Authorization": `Bearer ${paymentsApiKey}`
      }
    });

    if (!txResponse.ok) {
      throw new Error(`Failed to fetch transactions from payments API: ${txResponse.statusText}`);
    }

    const transactions = await txResponse.json() as Array<{
      amount: string;
      status: string;
    }>;

    let totalAmountMoved = 0;
    for (const tx of transactions) {
      if (tx.status === "APPROVED") {
        totalAmountMoved += Number(tx.amount) || 0;
      }
    }

    // Fetch shipments from the shipping service to calculate envios metrics
    let enviosMetric = "0";
    let enviosStatusText = "En tránsito: 0 | Entregados: 0 | Pendientes: 0";
    let enviosItems = mockDashboardData.sections.envios.items;

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

        // Map recent shipments (first 4) to the items list, sorted by createdAt descending
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
      }
    } catch (err) {
      console.error("Error fetching shipments for main dashboard overview:", err);
    }

    const dashboardData = {
      ...mockDashboardData,
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
        ...mockDashboardData.sections,
        envios: {
          ...mockDashboardData.sections.envios,
          metric: enviosMetric,
          statusText: enviosStatusText,
          items: enviosItems,
        }
      }
    };
    console.log("Dashboard data: ", dashboardData);

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data from Clerk:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

