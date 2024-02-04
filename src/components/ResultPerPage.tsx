import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FC } from "react";

interface ResultPerPageProps {
  value: string;
  onChange: (value: string) => void;
}

export const ResultPerPage: FC<ResultPerPageProps> = ({ onChange, value }) => {
  return (
    <div>
      <Label htmlFor="limit">Books per page</Label>
      <Select name="limit" value={value} onValueChange={onChange}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24">24</SelectItem>
          <SelectItem value="48">48</SelectItem>
          <SelectItem value="72">72</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
