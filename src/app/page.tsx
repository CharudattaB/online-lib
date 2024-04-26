"use client";
import { Category2, TrendingUp } from "tabler-icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BookCard } from "@/components/BookCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { data: trendingBooks, isLoading: isBooksLoading } = useQuery({
    queryKey: ["trendingBooks"],
    queryFn: async () => {
      const res = await fetch("/api/resources/trending", { cache: "no-store" });
      return res.json();
    },
  });

  const { data: genres, isLoading: isGenresLoading } = useQuery({
    queryKey: ["genre"],
    queryFn: async () => {
      const res = await fetch("/api/resources/genre", { cache: "no-store" });
      return res.json();
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const searchParams = new URLSearchParams();
    searchParams.set("s", data.search);
    router.push(`/books?${searchParams.toString()}`);
  });

  return (
    <>
      <div className="bg-primary-foreground">
        <Header />
      </div>
      <main className="grid">
        <section className="px-4 py-16 bg-primary-foreground">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold mx-32">
              Get into your library
            </h1>
            <p className="text-xl opacity-80">
              A wealth of knowledge just a click away
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 max-w-xl mx-auto mt-4">
              <Input
                placeholder="What are you looking for?"
                {...form.register("search")}
              />
              <Button>Go</Button>
            </div>
          </form>
        </section>
        <section className="container px-8 py-16">
          <div className="flex gap-2 items-center">
            <TrendingUp className="text-green-500" size={28} />
            <h1 className="text-2xl font-bold">Trending Books</h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-8">
            {isBooksLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              trendingBooks.books?.map((book: any, idx: number) => (
                <BookCard key={idx} data={book} />
              ))
            )}
          </div>
        </section>
        <section className="container px-8 py-8">
          <div className="flex gap-2 items-center">
            <Category2 className="text-indigo-500" size={24} />
            <h1 className="text-2xl font-bold">Genres</h1>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-8">
            {isGenresLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              genres.genres?.map((genre: any, idx: number) => (
                <Link href={`/books?genre=${genre.label}`} key={idx}>
                  <Card key={idx}>
                    <CardContent className="mt-6">
                      <CardTitle>{genre.label}</CardTitle>
                      <p className="mt-2">{genre.count} Books</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
