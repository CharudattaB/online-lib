"use client";
import { BookFilter } from "@/app/books/(components)/BookFilter";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useRouterQueryState } from "@/lib/hooks/useQueryState";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { BookTable } from "./BooksTable";
import { Button } from "@/components/ui/button";
import { Paginate } from "@/components/Pagination";
import Link from "next/link";
import { Suspense } from "react";

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
      const res = await fetch("/api/resources?" + query.toString());
      return res.json();
    },
  });
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <TabsContent value="books">
        <div className="container">
          <div className="grid grid-cols-8">
            <div className="col-span-2 p-4 sticky top-0 left-0 items-stretch">
              {isLoading ? (
                <Loader2 className="animate-spin text-center" />
              ) : (
                <>
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
                  <div className="mt-8 w-full">
                    <Paginate data={data?.pagination} />
                  </div>
                </>
              )}
            </div>
            <div className="col-span-6">
              <div className="flex gap-4 justify-between items-center py-4">
                <h1>Books</h1>
                <div className="flex gap-4 items-center">
                  <Link href="/admin/approvals">Approvals</Link>
                  <Link href="/admin/books/new">
                    <Button>New</Button>
                  </Link>
                </div>
              </div>
              {isLoading ? (
                <Loader2 className="animate-spin text-center" />
              ) : (
                <BookTable data={data?.books} />
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Suspense>
  );
};

export default Page;
