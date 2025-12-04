"use client";

import Link from "next/link";

export function SimpleHeader() {
  return (
    <header className="bg-black text-white p-4">
      <Link href="/app" className="text-xl font-bold">
        RCG Fitness
      </Link>
    </header>
  );
}
