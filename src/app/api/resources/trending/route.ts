/**
 * url: /api/resources
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const books = await prisma.resource.findMany({
    orderBy: {
      trendIndex: "desc",
    },
    take: 5,
    include: {
      stock: {
        select: {
          quantity: true,
        },
      },
    },
  });

  return Response.json({
    books,
  });
}
// export async function POST(request: NextRequest) {}
