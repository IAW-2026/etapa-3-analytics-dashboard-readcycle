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
    
    const productMap: Record<string, {
      id: string;
      title: string;
      author: string;
      category: string;
      sales: number;
      revenue: number;
      stock: number;
    }> = {};

    const categoryNameMap: Record<string, string> = {
      "Ficcion": "Ficción",
      "Accion": "Acción",
      "Cientificos": "Científicos",
    };

    const normalizeCategory = (name: string): string => {
      const trimmed = name.trim();
      return categoryNameMap[trimmed] || (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
    };

    if (Array.isArray(orders)) {
      for (const order of orders) {
        if (!order.items || !Array.isArray(order.items)) continue;
        for (const item of order.items) {
          const prod = item.product;
          if (!prod) continue;
          const id = prod.id || item.productId;
          if (!id) continue;

          const quantity = Number(item.quantity) || 0;
          const subtotal = Number(item.subtotal) || (quantity * (Number(item.price) || 0));

          if (!productMap[id]) {
            productMap[id] = {
              id,
              title: prod.title || "Producto Desconocido",
              author: prod.author || "Autor Desconocido",
              category: normalizeCategory(prod.category?.name || "Sin Categoría"),
              sales: 0,
              revenue: 0,
              stock: typeof prod.stock === "number" ? prod.stock : 0,
            };
          }

          productMap[id].sales += quantity;
          productMap[id].revenue += subtotal;
          if (typeof prod.stock === "number") {
            productMap[id].stock = prod.stock;
          }
        }
      }
    }

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return NextResponse.json(topProducts);
  } catch (error) {
    console.error("Error in /api/products/top route:", error);
    return NextResponse.json([]);
  }
}
