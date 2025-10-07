import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculations } from "@/shared/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await db.delete(calculations).where(eq(calculations.id, id));
    
    return NextResponse.json({ message: "Calculation deleted successfully" });
  } catch (error) {
    console.error("Error deleting calculation:", error);
    return NextResponse.json(
      { error: "Failed to delete calculation" },
      { status: 500 }
    );
  }
}
