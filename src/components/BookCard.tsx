import { Book2 } from "tabler-icons-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Resource } from "@prisma/client";
import { FC } from "react";

interface BookCardProps {
  data: Resource & { stock: Array<{ quantity: number }> };
}

export const BookCard: FC<BookCardProps> = ({ data }) => {
  console.log(data);
  const publishedYear =
    new Date(data?.publishedYear || "")?.getFullYear() || "N/A";
  const isAvailable =
    data.stock.reduce((acc, curr) => acc + curr.quantity, 0) > 0;

  return (
    <Card className="border-none">
      <div className="flex items-center justify-center bg-primary-foreground rounded-lg aspect-[16/9]">
        <Book2 size={48} className="opacity-40" />
      </div>
      <div className="text-xl mt-4">
        <h1 className="text-lg truncate" title={data.title}>
          {data.title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-sm opacity-50">
            {data.genre} | {publishedYear}
          </h1>
          <Badge variant="secondary">
            {isAvailable ? "Available" : "No Stock"}
          </Badge>
        </div>
        {/* <Separator className="my-4" /> */}
        <Button className="w-full mt-4" variant="outline" asChild>
          <Link href={`/books/${data.id}`}>Details</Link>
        </Button>
      </div>
    </Card>
  );
};
