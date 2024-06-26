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
    const approval = await prisma.stockAllocation.findUniqueOrThrow({
      where: {
        id: params.id,
      },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            isbn: true,
          },
        },
        allocatedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
        allocatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
        StockAllocationHistory: true,
      },
      // ...(token?.id
      //   ? {
      //       stockHistory: {
      //         where: {
      //           status: {
      //             in: ["Registered", "Approved", "Overdue"],
      //           },
      //           allocatedToId: token?.id as string,
      //         },
      //         select: {
      //           id: true,
      //           status: true,
      //         },
      //       },
      //     }
      //   : {}),
    });
    return NextResponse.json({
      status: 200,
      approval,
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
// export async function PATCH(response: NextRequest) {}
// export async function DELETE(response: NextRequest) {}
