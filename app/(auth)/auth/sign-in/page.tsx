import SignInForm from "@/features/auth/components/sign-in-form";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
        <Image
          src="/login.svg"
          alt="Login-Image"
          width={300}
          height={300}
          className="w-48 h-auto sm:w-64 md:w-80"
          priority
        />

        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default Page;