/**
 * url: /api/resources
 */

import { NextRequest, NextResponse, userAgent } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  // const password = await hash("admin", 10);
  // const college = await prisma.user.create({
  //   data: {
  //     name: "Admin",
  //     email: "admin@test.com",
  //     password,
  //     collegeId: "cls66kxaj0000ob37paplkl3k",
  //   },
  // });

  return Response.json({ success: true });
}
// export async function POST(request: NextRequest) {}
