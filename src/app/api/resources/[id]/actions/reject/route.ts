/**
 * url : api/resources/[id]/actions
 */
import { parseRequest } from "@/lib/helpers/api";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextParams } from "../../type";
import { StockAllocationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
// type -> assign
export async function POST(req: NextRequest, p: NextParams) {
  // remark
  const token = await getToken({ req });
  const userId = token?.id as string;
  const { body, params } = await parseRequest(req, p);

  const bookId = params.id;
  const { remark, stockAllocationId } = body;
  // set startDate and endDate as null
  console.log({ body });
  const updatedHistory = await prisma.stockAllocation.update({
    where: {
      id: stockAllocationId,
      // resourceId: bookId,
      status: StockAllocationStatus.Registered,
    },
    data: {
      status: StockAllocationStatus.Rejected,
      remark,
    },
  });

  if (!updatedHistory) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "OTP does not match or Book not available",
      },
      success: false,
    });
  }

  await prisma.stockAllocationHistory.create({
    data: {
      action: StockAllocationStatus.Rejected,
      stockAllocationId: updatedHistory.id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
