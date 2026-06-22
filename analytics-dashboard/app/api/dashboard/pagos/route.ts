import { NextResponse } from "next/server";
import { mockPagosData } from "@/app/dashboard/pagos/pagosData";

export async function GET() {
  // Simular latencia de consulta
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(mockPagosData);
}
