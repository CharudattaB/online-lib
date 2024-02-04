"use client";

import React, { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export const NextAuthSessionProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
