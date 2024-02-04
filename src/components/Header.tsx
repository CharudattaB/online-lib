"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export const Header = () => {
  const router = useRouter();
  const { data, status } = useSession();

  return (
    <header className="border-b border-primary-foreground h-16">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">Library</Link>
          <div className="flex items-center gap-8">
            <Link href="/books">Books</Link>
            {status === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : status === "unauthenticated" ? (
              <Button onClick={() => router.push("/login")}>Login</Button>
            ) : (
              <Link href="/me">
                <Avatar>
                  <AvatarImage src={data?.user?.image || ""} />
                  <AvatarFallback className="bg-primary text-white w-8 h-8">
                    {data?.user?.name?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
