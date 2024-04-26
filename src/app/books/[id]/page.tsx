"use client";
import { BookCard } from "@/components/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  College,
  Resource,
  Stock,
  StockAllocation,
  StockAllocationHistory,
  StockAllocationStatus,
} from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { title } from "process";
import { Book2 } from "tabler-icons-react";

const availableList = [
  {
    id: 1,
    college: "College of Engineering Pune",
    libLocation: "Self/L1S",
    quantity: 2,
  },
  {
    id: 2,
    college: "Army Institute of Technology",
    libLocation: "Self/L1S",
    quantity: 6,
  },
];

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["books", id],
    queryFn: async () => {
      const res = await fetch("/api/resources/" + id);
      return res.json() as Promise<{
        resource: Resource & {
          stockHistory: Array<StockAllocation>;
          stock: Array<Stock & { college: College }>;
        };
      }>;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["books/register", id],
    mutationFn: async (id: string) => {
      // post to /api/resources/:id/register
      const res = await fetch("/api/resources/" + id + "/actions/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: "{}",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book Reserved",
        description: "Collect book from library",
      });
      refetch();
    },
  });

  const resource = data?.resource;
  const publishedYear =
    new Date(resource?.publishedYear || "")?.getFullYear() || "N/A";

  const isAvailable =
    (resource?.stock?.reduce((acc, curr) => acc + curr.quantity, 0) || 0) > 0;

  const alreadyHaveBook = (resource?.stockHistory?.length || 0) > 0;

  return (
    <div className="container">
      <div className="flex gap-12 py-12">
        <div className="sticky top-9 left-0 self-start">
          <div className="flex items-center justify-center bg-primary-foreground rounded-lg aspect-square min-w-[320px] w-[15vw]">
            <Book2 size={48} className="opacity-40" />
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-bold">{resource?.title}</h1>
          <h2 className="text-lg font-bold opacity-60">
            By {resource?.author}
          </h2>
          <Badge className="text-lg mt-4 rounded-md" variant="secondary">
            {resource?.genre}
          </Badge>
          <Separator className="my-4" />
          {isAvailable ? (
            <>
              <Button
                disabled={alreadyHaveBook || isPending}
                onClick={() => !alreadyHaveBook && mutate(id)}
              >
                {isPending ? "Reserving..." : "Reserve"}
              </Button>
              <div className="my-2 text-orange-500">
                {alreadyHaveBook
                  ? resource?.stockHistory?.at(0)?.status ===
                    StockAllocationStatus.Registered
                    ? "You already register for this book"
                    : "You already have this book"
                  : null}
              </div>
            </>
          ) : (
            <Button>Notify </Button>
          )}
          <Separator className="my-4" />
          <h1 className="mb-1">ISBN</h1>
          <p className="font-medium"># {resource?.isbn}</p>
          <h1 className="mt-4 mb-1">Description</h1>
          <p className="font-medium">
            {resource?.description || "No description available"}
          </p>
          <h1 className="mt-4 mb-1">Tags</h1>
          <div className="flex gap-2">
            {resource?.tags.map((tag, idx) => (
              <Badge className="rounded-md" variant="secondary" key={idx}>
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-8">
            <div>
              <h1 className="mt-4 mb-1">Publication Name</h1>
              <p className="font-medium">{resource?.publicationName}</p>
            </div>
            <div>
              <h1 className="mt-4 mb-1">Edition</h1>
              <p className="font-medium">{resource?.edition}</p>
            </div>
            <div>
              <h1 className="mt-4 mb-1">Published Year</h1>
              <p className="font-medium">{publishedYear}</p>
            </div>
            <div>
              <h1 className="mt-4 mb-1">Language</h1>
              <p className="font-medium">{resource?.language}</p>
            </div>
          </div>
          <Separator className="mt-8" />

          <Table>
            <TableCaption>Books Availability</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead className="w-[100px]">Shelf</TableHead>
                <TableHead className="w-[100px]">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resource?.stock ? (
                resource?.stock.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {s.college.name}
                    </TableCell>
                    <TableCell>{s.libLocation}</TableCell>
                    <TableCell>{s.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="py-12">
        <h1 className="text-2xl font-bold mb-6">Similar Books</h1>
        <div className="grid grid-cols-5">{/* <BookCard /> */}</div>
      </div>
    </div>
  );
};
export default Page;
