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
            🚀 Next.js App
          </Link>
        </h1>

        {/* Event-Suche */}
        <div className="relative">
          <button
            onClick={toggleFilters}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔍 Events suchen
          </button>

          {filtersVisible && (
            <div className="absolute left-0 mt-2 bg-gray-800 text-white p-6 rounded shadow-lg w-72">
              <h3 className="text-lg font-semibold mb-4">🔎 Filteroptionen</h3>
              
              <label className="block text-gray-400 mb-2">📍 Ort</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                placeholder="Ort eingeben"
              />

              <label className="block text-gray-400 mt-4 mb-2">📅 Datum</label>
              <input
                type="date"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />

              <label className="block text-gray-400 mt-4 mb-2">📂 Kategorie</label>
              <select
                className="w-full p-2 rounded bg-gray-700 text-white"
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

              <button
                onClick={handleSearch}
                className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                🔎 Suchen
              </button>
            </div>
          )}
        </div>

        {/* Suchfeld */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Stichwort suchen"
            className="p-2 rounded bg-gray-800 text-white w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Suchen
          </button>
        </div>

        {/* Meine Bestellungen */}
        <div>
          <Link href="/meine-buchungen" className="hover:text-gray-300 transition-colors">
            📋 Meine Bestellungen
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
