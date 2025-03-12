"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link href="/">🚀 Next.js App</Link>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-gray-300 transition-colors">
                📦 Übersicht
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
