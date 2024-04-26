import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Resource, StockAllocation, User } from "@prisma/client";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface Props {
  data: Array<
    StockAllocation & {
      allocatedTo: User;
      resource: Resource;
      allocatedBy?: User;
    }
  >;
  selected: string;
  onClick: (id: string) => void;
}

// stock
// allocatedTo
// allocatedBy
// college
// resource
// StockAllocationHistory

export const ApprovalTables = ({ data, onClick, selected }: Props) => {
  return (
    <>
      <div className="py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-6"></TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>To</TableHead>
              <TableHead>By</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((allocation, i) => (
              <TableRow
                key={allocation.id}
                className={clsx("cursor-pointer")}
                onClick={() => onClick(allocation.id)}
              >
                <TableCell>
                  <Checkbox checked={selected === allocation.id} />
                </TableCell>
                <TableCell className="font-medium">
                  {allocation.resource.isbn}
                </TableCell>
                <TableCell>{allocation.resource.title}</TableCell>
                <TableCell>{allocation.allocatedTo.name}</TableCell>
                <TableCell>{allocation.allocatedBy?.name || "NA"}</TableCell>
                <TableCell className="text-right">
                  {allocation.quantity}
                </TableCell>
                <TableCell className="text-right">
                  {allocation.status}
                </TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
