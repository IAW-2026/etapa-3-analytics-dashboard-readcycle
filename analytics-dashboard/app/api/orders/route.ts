import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sellerBaseUrl = process.env.SELLER_DEPLOY_PATH || "https://proyecto-c-seller-readcycle.vercel.app/";
    const sellerApiKey = process.env.SELLER_API_KEY ? process.env.SELLER_API_KEY.replace(/^"|"$/g, "") : "";

    if (!sellerApiKey) {
      throw new Error("SELLER_API_KEY is not defined in environment variables");
    }

    const url = `${sellerBaseUrl.replace(/\/$/, "")}/api/public/orders`;

    const res = await fetch(url, {
      headers: {
        "X-API-Key": sellerApiKey
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch orders from Seller API: ${res.statusText}`);
    }

    const orders = await res.json();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error in /api/orders route:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
