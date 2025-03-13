"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<{ _id: string; title: string; available_seats: number }[]>([]);
  const [title, setTitle] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/events");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Events");
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !availableSeats) {
      alert("Bitte Titel und Plätze eingeben.");
      return;
    }
    const eventData = { title, available_seats: Number(availableSeats) };

    try {
      const response = await fetch("http://127.0.0.1:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern der Daten");

      const result = await response.json();
      setEvents((prevEvents) => [...prevEvents, { ...eventData, _id: result.id }]);
      setTitle("");
      setAvailableSeats("");
      alert("Event erfolgreich hinzugefügt!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-5xl font-extrabold text-white mb-8 text-center">🎟️ Event Buchung</h1>

      {loading && <p className="text-blue-400 text-lg">🔄 Daten werden geladen...</p>}
      {error && <p className="text-red-400 text-lg">⚠️ Fehler: {error}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">➕ Neues Event</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Titel"
          className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-700 text-white shadow-sm focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="number"
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          placeholder="Verfügbare Plätze"
          className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-700 text-white shadow-sm focus:ring focus:ring-blue-300"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          ➕ Hinzufügen
        </button>
      </form>

      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">🎭 Verfügbare Events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {events.map((event) => (
              <div key={event._id} className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center w-64">
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-300">Verfügbare Plätze: {event.available_seats ?? "Nicht verfügbar"}</p>
                <button
                  onClick={() => bookEvent(event._id)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
                >
                  🎟️ Buchen
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg text-center">Keine Events verfügbar.</p>
        )}
      </div>
    </div>
  );

  async function bookEvent(eventId: string) {
    try {
      const response = await fetch("http://127.0.0.1:3001/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await response.json();
      if (data.message === "Buchung erfolgreich!") {
        alert("Buchung erfolgreich!");
        fetchEvents();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Fehler beim Buchen des Events:", error);
    }
  }
}
