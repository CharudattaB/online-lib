"use client";
import { FC } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useRouter } from "next/navigation";

interface PaginationProps {
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const getPaginationUrl = (page: number, params: ReadonlyURLSearchParams) => {
  const p = new URLSearchParams(params);
  p.set("page", page.toString());
  return `?${p.toString()}`;
};

export const Paginate: FC<PaginationProps> = ({ data }) => {
  const { hasNext, hasPrevious } = data;
  const router = useRouter();
  const location = usePathname();
  const params = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="secondary"
        disabled={!hasPrevious}
        onClick={() =>
          router.push(location + getPaginationUrl(page - 1, params))
        }
      >
        <ChevronLeft className="mr-2 opacity-50" size={18} />
        Previous
      </Button>
      <Button
        variant="secondary"
        disabled={!hasNext}
        onClick={() =>
          router.push(location + getPaginationUrl(page + 1, params))
        }
      >
        Next
        <ChevronRight className="mr-2 opacity-50" size={18} />
      </Button>
    </div>
  );
};
