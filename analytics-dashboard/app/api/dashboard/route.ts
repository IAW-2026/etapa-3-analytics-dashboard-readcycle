import { NextResponse } from "next/server";
import { mockDashboardData } from "@/app/dashboard/data";

export async function GET() {
  // Simulate database/API query delay of 300ms
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(mockDashboardData);
}
