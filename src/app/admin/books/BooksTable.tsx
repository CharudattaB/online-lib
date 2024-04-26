import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Resource } from "@prisma/client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Adjustments, Menu } from "tabler-icons-react";

interface Props {
  data: Array<Resource & { stock: Array<{ quantity: number }> }>;
}

export const BookTable = ({ data }: Props) => {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ISBN</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((book, i) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.isbn}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="text-right">
                {book?.stock?.reduce((acc, cur) => acc + cur.quantity, 0)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-4 ml-8">
                      <Adjustments className="w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Button variant="link">View</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button variant="link">Edit</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button variant="link" className="text-red-500">
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
