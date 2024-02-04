import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/utils";
import { FC } from "react";

interface FilterValue {
  label: string;
  value: string;
  count: number;
}

interface BookFilterProps {
  data: {
    genres: FilterValue[];
    authors: FilterValue[];
    languages: FilterValue[];
  };
  value: {
    s: string;
    genre: string;
    author: string;
    language: string;
  };
  onChange: {
    s: (value: string) => void;
    genre: (value: string) => void;
    author: (value: string) => void;
    language: (value: string) => void;
  };
}

export const BookFilter: FC<BookFilterProps> = ({ data, value, onChange }) => {
  const handleSearchChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange.s(e.target.value),
    1000
  );
  return (
    <div className="w-full border-r p-4">
      <Input
        autoFocus
        placeholder="Search..."
        defaultValue={value.s}
        onChange={handleSearchChange}
      />
      <Accordion type="multiple" className="w-full mt-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>Genre</AccordionTrigger>
          <AccordionContent>
            <Select
              name="sort"
              value={value.genre}
              onValueChange={onChange.genre}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Genre</SelectLabel>
                  {data.genres.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label} ({item.count})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {value.genre && (
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => onChange.genre("")}
              >
                Reset
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Authors</AccordionTrigger>
          <AccordionContent>
            <Select
              name="sort"
              value={value.author}
              onValueChange={onChange.author}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Authors</SelectLabel>
                  {data.authors.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label} ({item.count})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {value.author && (
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => onChange.author("")}
              >
                Reset
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Language</AccordionTrigger>
          <AccordionContent className="p-1">
            <Select
              name="language"
              value={value.language}
              onValueChange={onChange.language}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {data.languages.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label} ({item.count})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {value.language && (
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => onChange.language("")}
              >
                Reset
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
