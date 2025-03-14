"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    category: "",
    keyword: "",
  });

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleSearch = () => {
    console.log("Suchparameter:", filters);
  };

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            <span className="highlight">🎫</span> EventBooker
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
              <Link href="/erstellen" className="hover:text-white transition-colors">
                ✨ Event erstellen
              </Link>
            </li>
          </ul>
        </nav>

        {/* Event Search */}
        <div className="relative">
          <button
            onClick={toggleFilters}
            className="bg-primary hover:bg-secondary transition-all"
          >
            🔍 Events suchen
          </button>

          {filtersVisible && (
            <div className="absolute right-0 mt-2 bg-card-bg text-card-text p-6 rounded-lg shadow-lg w-72 z-50">
              <h3 className="text-lg font-semibold mb-4">🔎 Filteroptionen</h3>
              
              <div className="form-group">
                <label>📍 Ort</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  placeholder="Ort eingeben"
                />
              </div>

              <div className="form-group">
                <label>📅 Datum</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>📂 Kategorie</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">Alle Kategorien</option>
                  <option value="Sport">Sport</option>
                  <option value="Weiterbildung">Weiterbildung</option>
                  <option value="Konzert">Konzert</option>
                  <option value="Networking">Networking</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div className="flex mt-4 gap-2">
                <input
                  type="text"
                  placeholder="🔍 Stichwort"
                  className="flex-1"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                />
                <button
                  onClick={handleSearch}
                  className="bg-success hover:bg-success"
                >
                  🔎
                </button>
              </div>
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div>
          <Link href="/meine-buchungen" className="hover:text-gray-300 transition-colors flex items-center">
            <span className="bg-primary px-2 py-1 rounded-full mr-2 text-sm">3</span>
            📋 Meine Buchungen
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;