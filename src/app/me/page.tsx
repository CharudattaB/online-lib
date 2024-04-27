"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { data } = useSession();
  const { push } = useRouter();

  const handleSignOut = () => {
    signOut();
    push("/login");
  };

  useEffect(() => {
    if (!data?.user.id) {
      push("/login");
    }
  }, [data?.user.id, push]);

  return (
    <div className="p-8">
      <h1> Hi, {data?.user?.name}</h1>

      <br />

      <Button onClick={handleSignOut}>Logout</Button>
    </div>
  );
};
export default Page;
