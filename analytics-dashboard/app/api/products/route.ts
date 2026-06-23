import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sellerBaseUrl = process.env.SELLER_DEPLOY_PATH || "https://proyecto-c-seller-readcycle.vercel.app/";
    const sellerApiKey = process.env.SELLER_API_KEY ? process.env.SELLER_API_KEY.replace(/^"|"$/g, "") : "";
    
    if (!sellerApiKey) {
      throw new Error("SELLER_API_KEY is not defined in environment variables");
    }

    const url = `${sellerBaseUrl.replace(/\/$/, "")}/api/public/products`;

    const res = await fetch(url, {
      headers: {
        "X-API-Key": sellerApiKey
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products from Seller API: ${res.statusText}`);
    }

    const products = await res.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in /api/products route:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
