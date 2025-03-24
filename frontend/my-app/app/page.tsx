"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Event {
  _id: string;
  title: string;
  capacity: number;
  available_seats: number;
  date: string;
  location: string;
  type: string;
  short_description: string;
  long_description: string;
  tags: string[];
}

export default function Home() {
  const searchParams = useSearchParams();
  const s = searchParams?.get("search") || "";
  const loc = searchParams?.get("location") || "";
  const d = searchParams?.get("date") || "";
  const cat = searchParams?.get("category") || "";

  const query = JSON.stringify({ s, loc, d, cat });

  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const eventTypes = ["Konzert", "Sport", "Networking", "Workshop", "Weiterbildung"];

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { s, loc, d, cat } = JSON.parse(query);
      const params = new URLSearchParams();
      if (s) params.append("search", s);
      if (loc) params.append("location", loc);
      if (d) params.append("date", d);
      if (cat) params.append("category", cat);

      let url = "http://127.0.0.1:3001/events";
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Fehler beim Abrufen der Events");
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventCapacity = Number(capacity);
    if (!title || isNaN(eventCapacity) || eventCapacity <= 0 || !date || !location || !type) {
      alert("Bitte fülle alle erforderlichen Felder aus.");
      return;
    }

    const eventData = {
      title,
      capacity: eventCapacity,
      date,
      location,
      type,
      short_description: shortDescription,
      long_description: longDescription,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const response = await fetch("http://127.0.0.1:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern der Daten");

      const result = await response.json();
      setEvents((prevEvents) => [
        ...prevEvents,
        { ...eventData, _id: result.id, available_seats: eventCapacity },
      ]);
      setTitle("");
      setCapacity("");
      setDate("");
      setLocation("");
      setType("");
      setShortDescription("");
      setLongDescription("");
      setTags("");
      alert("Event erfolgreich hinzugefügt!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    }
  };

  const bookEvent = async (eventId: string) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      alert("Bitte melde dich an, um Events zu buchen.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3001/events/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }), // ✅ Korrekt angepasst
      });

      const data = await response.json();
      if (response.ok) {
        alert("Buchung erfolgreich! Ihnen wurde eine Bestätigungsmail geschickt.");
        fetchEvents();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Fehler beim Buchen:", err);
      alert("Buchung fehlgeschlagen");
    }
  };

  return (
    <div className="event-page">
      <div className="container">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Event<span className="highlight">Booking</span>
        </h1>

        <div className="status-container">
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Lädt...</span>
            </div>
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* ───── Formular bleibt 1:1 unverändert ───── */}
        <div className="form-container">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-center">Neues Event erstellen</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Titel</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Kapazität</label>
                <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="location">Ort</label>
                <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="type">Kategorie</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="">Bitte wählen</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="shortDescription">Kurzbeschreibung</label>
                <input id="shortDescription" type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="longDescription">Eventbeschreibung</label>
                <input id="longDescription" type="text" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags (durch Komma getrennt)</label>
                <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
              <button type="submit" className="create-button hover:bg-primary/90 transition-all">
                <span>Erstellen</span>
              </button>
            </form>
          </div>
        </div>

        {/* ───── Event-Liste ───── */}
        <div className="events-container mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">Verfügbare Events</h2>
          {events.length === 0 && !loading ? (
            <p className="text-center text-gray-300">Keine Events verfügbar.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="card event-card hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/events/${event._id}`)}
                >
                  <div className="event-content">
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">
                      <strong>Datum:</strong> {event.date}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      <strong>Ort:</strong> {event.location}
                    </p>
                    <p className="text-sm text-gray-300 mb-2">{event.short_description}</p>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Plätze:</strong> {event.available_seats} verfügbar
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Verhindert Weiterleitung beim Klick auf Button
                        bookEvent(event._id);
                      }}
                      className="book-button hover:bg-green-600 transition-colors"
                    >
                      Buchen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
