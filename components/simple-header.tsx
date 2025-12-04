"use client";

import { useRouter } from "next/navigation";

export function SimpleHeader() {
  const router = useRouter();

  return (
    <header className="bg-background border-b border-border py-4 px-6 text-center">
      <h1
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => router.push("/")}
      >
        RCG Fitness
      </h1>
    </header>
  );
}
