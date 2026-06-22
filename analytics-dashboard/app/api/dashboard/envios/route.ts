import { NextResponse } from "next/server";
import { mockEnviosData } from "@/app/dashboard/envios/enviosData";

export async function GET() {
  // Simular latencia de consulta
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(mockEnviosData);
}
