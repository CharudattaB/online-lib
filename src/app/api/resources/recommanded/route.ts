/**
 * url: /api/resources
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true });
}
// export async function POST(request: NextRequest) {}
