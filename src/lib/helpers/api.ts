import { NextParams } from "@/app/api/resources/[id]/type";
import { NextRequest } from "next/server";

export const parseRequest = async <T extends NextParams>(
  request: NextRequest,
  p: T
) => {
  const body = await request.json();
  const params = p.params;
  return { body, params };
};
