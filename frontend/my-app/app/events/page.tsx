"use client";
import { useEffect, useState } from "react";

interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  booked: number;
  seats: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/events");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Events");
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🎟️ Veranstaltungen</h1>
      {events.length > 0 ? (
        <ul>
          {events.map((event: Event) => (
            <li key={event._id} className="border p-4 rounded bg-gray-100 mb-4">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>📍 {event.location} 📅 {event.date}</p>
              <p>
                Plätze: {event.booked}/{event.seats}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Events verfügbar.</p>
      )}
    </div>
  );
}
