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

    // Aggregate by category
    const categoryMap: Record<string, number> = {};

    if (Array.isArray(orders)) {
      for (const order of orders) {
        if (!order.items || !Array.isArray(order.items)) continue;
        for (const item of order.items) {
          const rawCategory = item.product?.category?.name || "Sin Categoría";
          const quantity = Number(item.quantity) || 0;
          categoryMap[rawCategory] = (categoryMap[rawCategory] || 0) + quantity;
        }
      }
    }

    const categoryNameMap: Record<string, string> = {
      "Ficcion": "Ficción",
      "Accion": "Acción",
      "Cientificos": "Científicos",
    };

    const normalizeCategory = (name: string): string => {
      const trimmed = name.trim();
      return categoryNameMap[trimmed] || (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
    };

    // Build the array
    const categoriesData = Object.entries(categoryMap)
      .map(([rawLabel, value]) => ({
        label: normalizeCategory(rawLabel),
        value
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(categoriesData);
  } catch (error) {
    console.error("Error in /api/products/categories route:", error);
    return NextResponse.json([]);
  }
}
