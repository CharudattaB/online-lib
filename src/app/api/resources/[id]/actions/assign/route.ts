/**
 * url : api/resources/[id]/actions
 */
import { NextRequest, NextResponse } from "next/server";
import { NextParams } from "../../type";
import { parseRequest } from "@/lib/helpers/api";
import { prisma } from "@/lib/prisma";
import { StockAllocationStatus } from "@prisma/client";
import { getToken } from "next-auth/jwt";

// type -> assign
export async function POST(req: NextRequest, p: NextParams) {
  const token = await getToken({ req });
  const userId = token?.id as string;
  const { body, params } = await parseRequest(req, p);

  const bookId = params.id;
  const { remark, otp, stockAllocationId } = body;

  const updatedHistory = await prisma.stockAllocation.update({
    where: {
      id: stockAllocationId,
      // resourceId: bookId,
      otp,
      status: StockAllocationStatus.Registered,
      stock: {
        quantity: {
          gt: 0,
        },
      },
    },
    data: {
      status: StockAllocationStatus.Approved,
      allocatedById: userId,
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

  await prisma.stock.update({
    where: {
      id: updatedHistory.stockId,
    },
    data: {
      quantity: {
        decrement: 1,
      },
    },
  });

  await prisma.stockAllocationHistory.create({
    data: {
      action: StockAllocationStatus.Approved,
      stockAllocationId: updatedHistory.id,
    },
  });

  return NextResponse.json({ success: true });
}
