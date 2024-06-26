/**
 * url : api/resources/[id]/actions
 */
import { parseRequest } from "@/lib/helpers/api";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextParams } from "../../type";
import { StockAllocationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, p: NextParams) {
  // remark
  // create stock history type IN
  const token = await getToken({ req });
  const userId = token?.id as string;
  const { body, params } = await parseRequest(req, p);

  const { remark, otp, stockAllocationId } = body;

  const updatedHistory = await prisma.stockAllocation.update({
    where: {
      id: stockAllocationId,
      otp,
      status: {
        in: [StockAllocationStatus.Overdue, StockAllocationStatus.Approved],
      },
    },
    data: {
      status: StockAllocationStatus.Returned,
      remark,
    },
  });

  if (!updatedHistory) {
    return NextResponse.json({
      status: 400,
      body: {
        error: "Book not found",
      },
      success: false,
    });
  }

  await prisma.stock.update({
    where: {
      id: updatedHistory.stockId,
    },
    data: {
      quantity: {
        increment: 1,
      },
    },
  });

  await prisma.stockAllocationHistory.create({
    data: {
      action: StockAllocationStatus.Returned,
      stockAllocationId: updatedHistory.id,
    },
  });

  return NextResponse.json({ success: true });
}
