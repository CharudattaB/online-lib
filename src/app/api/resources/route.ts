/**
 * url: /api/resources
 */
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

interface Filter {
  page: string | null;
  limit: string | null;
  sort: string | null;
  search: string | null;
  genre: string | null;
  author: string | null;
  publisher: string | null;
}

const getFilterQuery = (filter: Filter) => {
  const search = filter.search;
  const take = Math.max(1, parseInt(filter.limit || "24"));
  const skip = (Math.max(1, parseInt(filter.page || "1")) - 1) * take;
  const orderByField =
    filter.sort?.replace("-", "").replace("default", "createdAt") ||
    "createdAt";
  const genre = filter.genre;
  const author = filter.author;
  const publisher = filter.publisher;
  const orderBy = {
    [orderByField]: filter.sort?.startsWith("-") ? "desc" : "asc",
  };
  const where = {
    ...(search && {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          genre: {
            contains: search,
          },
        },
        {
          author: {
            contains: search,
          },
        },
      ],
    }),
    ...(genre && {
      genre,
    }),
    ...(author && {
      author,
    }),
    ...(publisher && {
      publisher,
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
  const genres = (
    await prisma.resource.groupBy({
      by: ["genre"],
      where,
      take: 24,
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

  const authors = (
    await prisma.resource.groupBy({
      by: ["author"],
      take: 24,
      where,
      orderBy: {
        _count: {
          author: "desc",
        },
      },
      _count: {
        author: true,
      },
    })
  ).map((author) => ({
    value: author.author,
    label: author.author,
    count: author._count.author,
  }));

  const languages = (
    await prisma.resource.groupBy({
      by: ["language"],
      take: 24,
      where,
      orderBy: {
        _count: {
          language: "desc",
        },
      },
      _count: {
        language: true,
      },
    })
  ).map((lng) => ({
    value: lng.language,
    label: lng.language,
    count: lng._count.language,
  }));

  return {
    genres,
    authors,
    languages,
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
  const genre = request.nextUrl.searchParams.get("genre");
  const author = request.nextUrl.searchParams.get("author");
  const publisher = request.nextUrl.searchParams.get("publisher");

  const params = {
    page,
    limit,
    sort,
    search,
    genre,
    author,
    publisher,
  };

  const filters = getFilterQuery(params);

  const books = await prisma.resource.findMany({
    ...filters,
    include: {
      stock: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const totalBooks = await prisma.resource.count({
    where: filters.where,
  });

  return Response.json({
    filters: await getAvailableFilters(params),
    books,
    pagination: getPaginationData(totalBooks, Number(page || 1), filters.take),
  });
}
export async function POST(request: NextRequest) {}
