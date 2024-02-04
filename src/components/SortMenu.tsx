import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const sortConfig = [
  {
    value: "default",
    label: "Default",
  },
  {
    value: "title",
    label: "Title",
  },
  {
    value: "author",
    label: "Author",
  },
  {
    value: "createdAt",
    label: "Date (Oldest first)",
  },
  {
    value: "-createdAt",
    label: "Date (Newest first)",
  },
];

interface SortMenuProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortMenu: React.FC<SortMenuProps> = ({ onChange, value }) => {
  return (
    <div>
      <Label htmlFor="sort">Sort By</Label>
      <Select name="sort" value={value} onValueChange={onChange}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            {sortConfig.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
