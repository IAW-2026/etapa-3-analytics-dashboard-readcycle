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

