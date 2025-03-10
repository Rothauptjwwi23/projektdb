"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<{ id: number; name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching data from backend...");
      const response = await fetch("http://localhost:3001/data");

      if (!response.ok) throw new Error("Fehler beim Abrufen der Daten");

      const jsonData = await response.json();
      console.log("Backend Response:", jsonData);
      setData(jsonData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !value) {
      alert("Bitte Name und Wert eingeben.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value: Number(value) }),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern der Daten");

      const result = await response.json();
      console.log("Neue Daten hinzugefügt:", result);

      // Aktualisiere die Liste mit den neuen Daten
      setData([...data, result.entry]);

      // Formular zurücksetzen
      setName("");
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">📊 Backend-Daten</h1>

      {loading && (
        <p className="text-blue-600 bg-blue-100 p-3 rounded-lg shadow-md">🔄 Daten werden geladen...</p>
      )}

      {error && (
        <p className="text-red-700 bg-red-200 p-3 rounded-lg shadow-md">⚠️ Fehler: {error}</p>
      )}

      {/* Formular zum Hinzufügen von Daten */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">➕ Neues Produkt hinzufügen</h2>
        <div className="mb-3">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Wert:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          ➕ Hinzufügen
        </button>
      </form>

      {/* Produktliste */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        {data.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item) => (
              <li key={item.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-700">💰 Wert: <span className="font-bold text-blue-600">{item.value}</span></p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">📭 Keine Produkte verfügbar.</p>
        )}
      </div>
    </div>
  );
}
