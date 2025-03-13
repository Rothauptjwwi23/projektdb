import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Next.js App - Alle Rechte vorbehalten</p>
        <nav className="mt-4">
          <ul className="flex justify-center gap-6 text-gray-300">
            <li>
              <Link href="/impressum" className="hover:text-white transition-colors">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/agb" className="hover:text-white transition-colors">
                AGB
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-white transition-colors">
                Datenschutz
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
