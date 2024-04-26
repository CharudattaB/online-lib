/**
 * url : api/resources/[id]/actions
 */
import { prisma } from "@/lib/prisma";
import { parseRequest } from "@/lib/helpers/api";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextParams } from "../../type";
import { StockAllocationStatus } from "@prisma/client";

// type -> assign, return,
// export async function POST(request: NextRequest) {
//   // check if already assigned
//   // check max book capacity
//   // check stock first
//   // reduce stock
//   // create transaction
// }

// type -> assign
export async function POST(req: NextRequest, p: NextParams) {
  const token = await getToken({ req });
  console.log(token);
  if (!token)
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" },
      success: false,
    });

  const userId = token?.id as string;
  const { body, params } = await parseRequest(req, p);

  const bookId = params.id;

  const stock = await prisma.stock.findFirst({
    where: {
      resourceId: bookId,
    },
  });

  if (!stock) {
    return NextResponse.json({
      status: 404,
      body: {
        error: "Book not found",
      },
      success: false,
    });
  }

  if (stock.quantity < 1) {
    return NextResponse.json({
      status: 404,
      body: {
        error: "Book not available",
      },
      success: false,
    });
  }

  const startDate = new Date();
  // end date is 7 days from start date
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 7);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.stockAllocationHistory.create({
    data: {
      action: StockAllocationStatus.Registered,
      stockAllocation: {
        create: {
          status: StockAllocationStatus.Registered,
          quantity: 1,
          allocatedToId: userId,
          stockId: stock.id,
          startDate,
          endDate,
          otp,
          resourceId: bookId,
          otpGeneratedAt: new Date(),
        },
      },
    },
  });

  // remark
  // otp validation
  // create transaction
  // update stock history add allocatedBy and startDate
  return NextResponse.json({ success: true });
}
