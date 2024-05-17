import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler= NextAuth(authOptions )

export {handler as Get, handler as POST}