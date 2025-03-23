"use client";

import { useEffect, useState } from "react";

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

  const eventTypes = ["Konzert", "Sport", "Networking", "Workshop", "Weiterbildung"];

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
      setEvents((prevEvents) => [...prevEvents, { ...eventData, _id: result.id, available_seats: eventCapacity }]);
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

  async function bookEvent(eventId: string) {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      alert("Bitte melde dich an, um Events zu buchen.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId, seats: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Buchung erfolgreich!");
        fetchEvents();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Fehler beim Buchen:", err);
      alert("Buchung fehlgeschlagen");
    }
  }

  return (
    <div className="event-page">
      <div className="container">
        <h1>Event<span className="highlight">Booking</span></h1>

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

        <div className="form-container">
          <div className="card">
            <h2>Neues Event erstellen</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Titel</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Titel" required />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Kapazität</label>
                <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Anzahl der Plätze" min="1" required />
              </div>
              <div className="form-group">
                <label htmlFor="date">Datum</label>
                <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="location">Ort</label>
                <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ort des Events" required />
              </div>

              <div className="form-group">
                <label htmlFor="type">Kategorie</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="">Bitte wählen</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shortDescription">Kurzbeschreibung</label>
                <input id="shortDescription" type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Kurze Eventbeschreibung" required />
              </div>

              <div className="form-group">
                <label htmlFor="longDescription">Eventbeschreibung</label>
                <input id="longDescription" type="text" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Detaillierte Eventbeschreibung" required />
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (durch Komma getrennt)</label>
                <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tag1, Tag2, Tag3" />
              </div>

              <button type="submit" className="create-button">
                <span>Erstellen</span>
              </button>
            </form>
          </div>
        </div>

        <div className="events-container">
          <h2>Verfügbare Events</h2>
          {events.length === 0 && !loading ? (
            <p>Keine Events verfügbar.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="card event-card">
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                    <p>{event.short_description}</p>
                    <p><strong>Plätze:</strong> {event.available_seats} verfügbar</p>
                    <button onClick={() => bookEvent(event._id)} className="book-button">Buchen</button>
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
