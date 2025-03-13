"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            🚀 Next.js App
          </Link>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex gap-6 text-gray-300">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white transition-colors">
                🎭 Events
              </Link>
            </li>
            <li>
              <Link href="/meine-buchungen" className="hover:text-white transition-colors">
                📋 Meine Bestellungen
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
