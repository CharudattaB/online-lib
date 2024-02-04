/**
 * url : api/resources/[id]
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const resource = await prisma.resource.findUniqueOrThrow({
      where: {
        id: params.id,
      },
      include: {
        stock: {
          include: {
            college: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({
      status: 200,
      resource,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: 404,
      body: {
        error: "Book not found",
      },
      success: false,
    });
  }
}
export async function PATCH(response: NextRequest) {}
export async function DELETE(response: NextRequest) {}
