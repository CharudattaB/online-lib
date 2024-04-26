/**
 * url: /api/resources
 */
import { prisma } from "@/lib/prisma";
import { StockAllocationStatus } from "@prisma/client";
import { NextRequest } from "next/server";

interface Filter {
  page: string | null;
  limit: string | null;
  sort: string | null;
  search: string | null;
  allocatedTo: string | null;
  status: string | null;
}

const getFilterQuery = (filter: Filter) => {
  const search = filter.search;
  const take = Math.max(1, parseInt(filter.limit || "24"));
  const skip = (Math.max(1, parseInt(filter.page || "1")) - 1) * take;
  const orderByField =
    filter.sort?.replace("-", "").replace("default", "createdAt") ||
    "createdAt";

  const allocatedTo = filter.allocatedTo;
  const status = filter.status as StockAllocationStatus;
  const orderBy = {
    [orderByField]: filter.sort?.startsWith("-") ? "desc" : "asc",
  };
  const where = {
    ...(search && {
      OR: [
        {
          allocatedTo: {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                id: {
                  contains: search,
                },
              },
            ],
          },
        },
        {
          resource: {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                isbn: {
                  contains: search,
                },
              },
            ],
          },
        },
      ],
    }),

    ...(status && {
      status,
    }),
    ...(allocatedTo && {
      allocatedTo: {
        id: allocatedTo,
      },
    }),
  };

  return {
    take,
    skip,
    orderBy,
    where,
  };
};

const getAvailableFilters = async (filter: Filter) => {
  const { where } = getFilterQuery(filter);
  const statusFilter = (
    await prisma.stockAllocation.groupBy({
      by: ["status"],
      where,
      orderBy: {
        _count: {
          status: "desc",
        },
      },
      _count: {
        status: true,
      },
    })
  ).map((allocations) => ({
    value: allocations.status,
    label: allocations.status,
    count: allocations._count?.status,
  }));

  return {
    availableStatus: statusFilter,
  };
};

const getPaginationData = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrevious,
  };
};

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");
  const limit = request.nextUrl.searchParams.get("limit");
  const sort = request.nextUrl.searchParams.get("sort");
  const search = request.nextUrl.searchParams.get("s");
  const allocatedTo = request.nextUrl.searchParams.get("allocatedTo");
  const status = request.nextUrl.searchParams.get("status");

  const params = {
    page,
    limit,
    sort,
    search,
    allocatedTo,
    status,
  };

  const filters = getFilterQuery(params);

  const approvals = await prisma.stockAllocation.findMany({
    ...filters,
    include: {
      allocatedTo: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
      allocatedBy: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
      resource: {
        select: {
          title: true,
          id: true,
          isbn: true,
        },
      },
    },
  });

  const totalStockAllocations = await prisma.stockAllocation.count({
    where: filters.where,
  });

  return Response.json({
    filters: await getAvailableFilters(params),
    approvals,
    pagination: getPaginationData(
      totalStockAllocations,
      Number(page || 1),
      filters.take
    ),
  });
}
export async function POST(request: NextRequest) {
  const data = await request.json();
  const book = await prisma.resource.create({
    data,
  });
  return Response.json(book);
}
