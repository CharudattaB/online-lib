"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useWatch } from "./useWatch";

interface Options<T> {
  /**
   * will convert the value to string, default String(value)
   */
  serializer?: (value: T) => string | undefined;

  /**
   * will convert the string to value
   */
  deserializer?: (value: string) => T;
}

const useRouterQueryState = <T>(
  name: string,
  defaultValue?: T,
  opts: Options<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const serialize = (value: T): string | undefined => {
    if (opts.serializer) return opts.serializer(value);

    return String(value);
  };

  const deserialize = (value: string): T => {
    if (opts.deserializer) return opts.deserializer(value);

    // default deserializer for number type
    if (typeof defaultValue === "number") {
      const numValue = Number(value === "" ? "r" : value);
      return isNaN(numValue) ? (defaultValue as T) : (numValue as T);
    }
    return value as T;
  };

  const [state, setState] = useState<T>(() => {
    const value = searchParams.get(name);
    if (value === undefined || value === null) {
      return defaultValue as T;
    }
    return deserialize(value as string);
  });

  useWatch(() => {
    //! Don't manipulate the query parameter directly
    const serializedState = serialize(state);
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (serializedState === undefined) {
      current.delete(name);
    } else {
      current.set(name, serializedState);
    }

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [state, name]);

  return [state, setState];
};

export { useRouterQueryState };
