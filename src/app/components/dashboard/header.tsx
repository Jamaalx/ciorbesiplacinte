// src/components/dashboard/header.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getRoleLabel } from "@/lib/utils";

export default function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-2 text-gray-500 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300">
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold uppercase text-gray-600">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="hidden text-left md:block">
              <div className="font-medium">{session?.user?.name}</div>
              <div className="text-xs text-gray-500">
                {session?.user?.role ? getRoleLabel(session.user.role as string) : ""}
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2 text-sm text-gray-700">
                <div>{session?.user?.name}</div>
                <div className="text-xs text-gray-500">{session?.user?.email}</div>
              </div>
              <hr className="my-1" />
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Setări
              </a>
              <hr className="my-1" />
              <button
                onClick={() => signOut({ callbackUrl: "/autentificare/login" })}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Deconectare
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}