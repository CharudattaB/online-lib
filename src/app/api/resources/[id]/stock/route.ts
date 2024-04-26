import { NextRequest, NextResponse } from "next/server";

/**
 * url : /api/book/[id]/stock
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true });
}
// export async function POST(request: NextRequest) {}
