"use client";
import { Paginate } from "@/components/Pagination";
import { SortMenu } from "../../components/SortMenu";
import { BookList } from "./(components)/BookList";
import { ResultPerPage } from "@/components/ResultPerPage";
import { BookFilter } from "./(components)/BookFilter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouterQueryState } from "@/lib/hooks/useQueryState";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const filterMap = {
  genre: {
    label: "Genre",
    value: "genre",
  },
  author: {
    label: "Authors",
    value: "authors",
  },
  language: {
    label: "Languages",
    value: "languages",
  },
};

const Page = () => {
  const [sort, setSort] = useRouterQueryState("sort", "default");
  const [limit, setLimit] = useRouterQueryState("limit", "24");
  const [genre, setGenre] = useRouterQueryState("genre", "");
  const [author, setAuthor] = useRouterQueryState("author", "");
  const [language, setLanguage] = useRouterQueryState("language", "");
  const [s, setS] = useRouterQueryState("s", "");

  const query = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["books", query.toString()],
    queryFn: async () => {
      const res = await fetch("/api/resources?" + query.toString(), {
        cache: "no-store",
      });
      return res.json();
    },
  });

  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <section className="container pb-12">
        <div className="sticky top-0 left-0 flex items-end gap-2 justify-between bg-background pt-12 pb-8 z-10">
          <h1 className="text-xl font-bold py-2">
            {data?.pagination?.total} Results
          </h1>
          <div className="flex items-center gap-2">
            <SortMenu onChange={setSort} value={sort} />
            <ResultPerPage onChange={setLimit} value={limit} />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-8 pb-12">
          <div className="col-span-2">
            {isLoading ? (
              <Loader2 className="animate-spin text-center" />
            ) : (
              <BookFilter
                data={data.filters}
                value={{
                  genre,
                  author,
                  language,
                  s,
                }}
                onChange={{
                  genre: setGenre,
                  author: setAuthor,
                  language: setLanguage,
                  s: setS,
                }}
              />
            )}
          </div>
          <div className="col-span-5">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <BookList data={data?.books} />
                <div className="mt-8 w-full">
                  <Paginate data={data?.pagination} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Suspense>
  );
};
export default Page;
