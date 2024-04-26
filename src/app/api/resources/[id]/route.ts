/**
 * url : api/resources/[id]
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const token = await getToken({ req });
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
        ...(token?.id
          ? {
              stockHistory: {
                where: {
                  status: {
                    in: ["Registered", "Approved", "Overdue"],
                  },
                  allocatedToId: token?.id as string,
                },
                select: {
                  id: true,
                  status: true,
                },
              },
            }
          : {}),
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
