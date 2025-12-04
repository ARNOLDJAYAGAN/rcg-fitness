"use client";

import { useRouter } from "next/navigation";

export function SimpleHeader() {
  const router = useRouter();

  return (
    <header className="bg-black text-white p-4">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/")}  // <-- go to landing page
      >
        RCG Fitness
      </h1>
    </header>
  );
}
