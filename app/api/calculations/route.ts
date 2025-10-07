import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculations, insertCalculationSchema } from "@/shared/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allCalculations = await db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt));
    
    return NextResponse.json(allCalculations);
  } catch (error) {
    console.error("Error fetching calculations:", error);
    return NextResponse.json(
      { error: "Failed to fetch calculations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertCalculationSchema.parse(body);
    
    const [newCalculation] = await db
      .insert(calculations)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(newCalculation, { status: 201 });
  } catch (error) {
    console.error("Error creating calculation:", error);
    return NextResponse.json(
      { error: "Failed to create calculation" },
      { status: 400 }
    );
  }
}
