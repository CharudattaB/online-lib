/**
 * url: /api/resources
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: NextRequest) {
  const genres = (
    await prisma.resource.groupBy({
      by: ["genre"],
      take: 5,
      orderBy: {
        _count: {
          genre: "desc",
        },
      },
      _count: {
        genre: true,
      },
    })
  ).map((genre) => ({
    value: genre.genre,
    label: genre.genre,
    count: genre._count.genre,
  }));

  return Response.json({
    genres,
  });
}
// export async function POST(request: NextRequest) {}
