import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 character")
  .max(10, "Usename must be no more than 20 characters")
  .regex(/^[a-za-z0-9_]+$/, "Username must not contain special character")


export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'invalid email address' }),
  password: z.string().min(6, { message: "password mus be at least 6 characters" })
})
