import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Button>Get Started</Button>
      <UserButton />
    </div>
  );
}
