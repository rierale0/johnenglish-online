"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex justify-between items-center px-4 md:px-8 lg:px-8 py-4 bg-[#343154]">
      <Link href="/">
        <span className="flex items-center gap-1 cursor-pointer">
          <Image
            src="/favicon.png"
            height={30}
            width={30}
            alt="Logo"
            className="w-[30px] h-[30px] object-contain"
          />
          <p className="text-m text-white font-bold hidden md:block">
            English with John
          </p>
        </span>
      </Link>


    </nav>
  );
}
