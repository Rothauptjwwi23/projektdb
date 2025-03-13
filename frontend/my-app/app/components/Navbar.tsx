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
    <header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Home */}
        <h1 className="text-2xl font-bold cursor-pointer">
          <Link href="/" scroll={true}>
            🚀 Home
          </Link>
        </h1>

        {/* Events */}
        <div className="relative">
          <button
            onClick={toggleFilters}
            className="hover:text-gray-300 transition-colors"
          >
            Events
          </button>

          {/* Dropdown */}
          {filtersVisible && (
            <div className="absolute left-0 mt-2 bg-gray-800 text-white p-4 rounded shadow-md">
              <div className="mb-4">
                <label className="block">Ort</label>
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  placeholder="Ort eingeben"
                />
              </div>
              <div className="mb-4">
                <label className="block">Datum</label>
                <input
                  type="date"
                  className="w-full p-2 rounded"
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block">Kategorie</label>
                <select
                  className="w-full p-2 rounded"
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
            </div>
          )}
        </div>

        {/* Schlagwort suchen */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Schlagwort suchen"
            className="p-2 rounded"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Suchen
          </button>
        </div>

        {/* Meine Bestellungen */}
        <div>
          <Link href="/meine-buchungen" className="hover:text-gray-300 transition-colors">
            Meine Bestellungen
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
