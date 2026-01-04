"use client";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  return session?.data?.user;
};

const UserButton = () => {
  const user = useCurrentUser();
  return user ? <User /> : null;
};
export default UserButton;
