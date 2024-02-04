"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/schema/login";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) =>
      signIn("credentials", { redirect: false, ...payload }).then((res) => {
        if (!res?.ok) {
          throw new Error("Invalid Email or Password");
        }
      }),
    onSuccess: () => {
      toast({
        title: "Login Successful",
        variant: "default",
      });
      router.push("/");
    },
    onError: (error) =>
      toast({
        title: "Email or Password is incorrect",
        description: error.message,
        variant: "destructive",
      }),
  });
  const handleSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  return (
    <div className="grid h-[90vh]">
      <Card className="place-self-center w-[350px]">
        <CardHeader>
          <CardTitle>Login To Continue</CardTitle>
          <CardDescription>Use credentials provided by admin</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="james@bond.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending}>
                {isPending ? "Loading..." : "Login"}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
