import { BookCard } from "@/components/BookCard";
import { Resource } from "@prisma/client";
import { FC } from "react";
import { BookOff } from "tabler-icons-react";

interface BookListProps {
  data: Array<Resource & { stock: Array<{ quantity: number }> }>;
}

export const BookList: FC<BookListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center my-16 flex items-center flex-col">
        <BookOff size={64} className="mb-4 opacity-50" />
        <h1 className="text-lg">No books found</h1>
      </div>
    );
  }
  return (
    <section>
      <div className="grid grid-cols-3 gap-x-6 gap-y-8">
        {data.map((book, i) => (
          <BookCard key={i} data={book} />
        ))}
      </div>
    </section>
  );
};
