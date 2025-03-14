"use client";

import { useEffect, useState } from "react";

interface Event {
  _id: string;
  title: string;
  available_seats: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
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

  return (
    <div className="event-page">
      <div className="container">
        <h1>Event<span className="highlight">Booking</span></h1>

        {/* Status indicators */}
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

        {/* Creation form */}
        <div className="form-container">
          <div className="card">
            <h2>Neues Event erstellen</h2>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Titel</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event Titel"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="seats">Verfügbare Plätze</label>
                <input
                  id="seats"
                  type="number"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  placeholder="Anzahl der Plätze"
                  required
                />
              </div>
              
              <button type="submit" className="create-button">
                <span>Erstellen</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Events list */}
        <div className="events-container">
          <h2>Verfügbare Events</h2>
          
          {events.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Keine Events verfügbar.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="card event-card">
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-details">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>
                        {event.available_seats} {event.available_seats === 1 ? 'Platz' : 'Plätze'} verfügbar
                      </span>
                    </div>
                    <button
                      onClick={() => bookEvent(event._id)}
                      className="book-button"
                    >
                      <svg 
                        width="20"
                        height="20"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
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