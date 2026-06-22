import { NextResponse } from "next/server";
import { mockComprasData } from "@/app/dashboard/compras/comprasData";

export async function GET() {
  // Simular latencia de consulta
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(mockComprasData);
}
