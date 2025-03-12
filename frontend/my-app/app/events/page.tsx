"use client";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", location: "", type: "" });
  const [error, setError] = useState<string | null>(null);

  // Fetch Events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3001/events?${query}`);
      if (!response.ok) throw new Error("Fehler beim Abrufen der Events");
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  const handleBookEvent = async (eventId: number) => {
    try {
      const response = await fetch("http://localhost:3001/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) throw new Error("Fehler beim Buchen");
      fetchEvents(); // Liste aktualisieren
    } catch (err) {
      alert("Buchung fehlgeschlagen!");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">🎟️ Veranstaltungen</h1>

      {/* Filterformular */}
      <div className="mb-6 flex gap-4">
        <input
          type="date"
          placeholder="Datum"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Ort"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Alle</option>
          <option value="Konferenz">Konferenz</option>
          <option value="Festival">Festival</option>
          <option value="Networking">Networking</option>
        </select>
        <button onClick={fetchEvents} className="bg-blue-500 text-white px-4 py-2 rounded">🔍 Filtern</button>
      </div>

      {/* Event-Liste */}
      <ul className="space-y-4">
        {events.length > 0 ? (
          events.map((event: any) => (
            <li key={event.id} className="border p-4 rounded bg-gray-100">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>📍 {event.location} - 📅 {event.date} - 🏷️ {event.type}</p>
              <p>🪑 {event.booked} / {event.seats} Plätze belegt</p>
              <button onClick={() => handleBookEvent(event.id)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                ➕ Buchen
              </button>
            </li>
          ))
        ) : (
          <p>🚫 Keine Events gefunden.</p>
        )}
      </ul>
    </div>
  );
}
