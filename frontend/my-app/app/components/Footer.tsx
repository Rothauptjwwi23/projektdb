import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              <span className="highlight">🎫</span> EventBooker
            </h3>
            <p className="text-sm text-gray-400">Die einfachste Art, Events zu finden und zu buchen.</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Beliebte Kategorien</h3>
            <ul className="text-gray-400">
              <li className="mb-1">
                <Link href="/events?category=Konzert" className="hover:text-white transition-colors">
                  Konzerte
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/events?category=Workshop" className="hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/events?category=Sport" className="hover:text-white transition-colors">
                  Sport
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Rechtliches</h3>
            <ul className="text-gray-400">
              <li className="mb-1">
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/agb" className="hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} EventBooker - Alle Rechte vorbehalten</p>
        </div>
      </div>
    </footer>
  );
}