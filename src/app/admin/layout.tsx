"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

const config = [
  {
    label: "Books",
    value: "books",
    path: "/admin/books",
  },
  {
    label: "Approvals",
    value: "approvals",
    path: "/admin/approvals",
  },
  {
    label: "College",
    value: "college",
    path: "/admin/college",
  },
  {
    label: "Users",
    value: "users",
    path: "/admin/users",
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <main>
      <Tabs value={pathname.replace("/admin/", "")}>
        <TabsList className="flex w-full">
          {config.map((item) => (
            <TabsTrigger
              key={item.path}
              value={item.value.toLowerCase()}
              onClick={() => push(item.path)}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </main>
  );
};

export default Layout;
