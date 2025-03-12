"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<{ _id: string; name: string; value: number; seats: number; booked: number }[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Abrufen der Events beim Laden der Seite
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/events");
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Events");
      }
      const data = await response.json();
      setEvents(data.events); // Speichert die abgerufenen Events im State
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
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
    const eventData = { name, value: Number(value), seats: 50, booked: 0 };

    try {
      const response = await fetch("http://127.0.0.1:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern der Daten");

      const result = await response.json();
      setEvents((prevEvents) => [...prevEvents, { ...eventData, _id: result.id }]);
      setName("");
      setValue("");
      alert("Event erfolgreich hinzugefügt!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">📊 Backend-Daten</h1>

      {loading && <p className="text-blue-600">🔄 Daten werden geladen...</p>}
      {error && <p className="text-red-600">⚠️ Fehler: {error}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">➕ Neues Event hinzufügen</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
          className="w-full p-2 border rounded-lg mb-4"
          required
        />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Wert"
          className="w-full p-2 border rounded-lg mb-4"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          ➕ Hinzufügen
        </button>
      </form>

      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Verfügbare Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event._id} className="p-4 border rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <p>Wert: {event.value}</p>
                <p>Verfügbar: {event.seats - event.booked}</p>
                <button
                  onClick={() => bookEvent(event._id)}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                >
                  Buchen
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Events verfügbar.</p>
        )}
      </div>
    </div>
  );

  // Buchungsfunktion für Events
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
        fetchEvents(); // Nach der Buchung das Event neu laden
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Fehler beim Buchen des Events:", error);
    }
  }
}
