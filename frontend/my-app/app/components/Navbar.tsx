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
    <header className="bg-gray-800 text-white py-3 shadow-md sticky top-4 z-50 mx-4 rounded-lg">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Navigation */}
        <nav className="flex-1">
          <ul className="flex gap-8 text-gray-300">
            <li>
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <span>🏠</span> Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white transition-colors flex items-center gap-2">
                <span>🎭</span> Events
              </Link>
            </li>
            <li>
              <button
                onClick={toggleFilters}
                className="bg-primary hover:bg-secondary transition-all flex items-center gap-2"
              >
                <span>🔍</span> Events suchen
              </button>
            </li>
          </ul>
        </nav>

        {/* My Bookings - Right aligned */}
        <div>
          <Link href="/meine-buchungen" className="hover:text-white transition-colors flex items-center gap-2">
            <span className="bg-primary px-2 py-1 rounded-full text-sm">3</span>
            <span>📋</span> Meine Buchungen
          </Link>
        </div>

        {/* Filters dropdown */}
        {filtersVisible && (
          <div className="absolute right-0 top-14 mt-2 bg-card-bg text-card-text p-6 rounded-lg shadow-lg w-80 z-50">
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
                className="w-full"
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
                className="w-full"
              />
            </div>

            <div className="form-group">
              <label>📂 Kategorie</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full"
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
                className="bg-success hover:bg-success flex items-center justify-center px-4"
              >
                🔎
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;