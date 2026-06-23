import { NextResponse } from "next/server";

export async function GET() {
  // Simular latencia de consulta
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    title: "Métricas de Compras y Órdenes",
    statusText: "",
    totalPublishedProducts: {
      value: 0,
      delta: ""
    },
    topProducts: [],
    categoriesData: []
  });
}
