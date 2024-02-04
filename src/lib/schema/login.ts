import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long.",
    })
    .max(100, {
      message: "Password must be at most 100 characters long.",
    }),
});
