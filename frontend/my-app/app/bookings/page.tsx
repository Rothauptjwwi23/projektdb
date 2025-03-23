"use client";

import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  event_id: string;
  seats: number;
  status: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      setError("Du musst eingeloggt sein, um deine Buchungen zu sehen.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:3001/bookings/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Abrufen der Buchungen");
      }

      setBookings(data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  return (
    <div className="container">
      <h2>Meine Buchungen</h2>

      {error && <p className="error-message">{error}</p>}

      {bookings.length === 0 && !error ? (
        <p>Keine Buchungen vorhanden.</p>
      ) : (
        <div className="events-grid">
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <h3>Buchung: {b._id}</h3>
              <p><strong>Event ID:</strong> {b.event_id}</p>
              <p><strong>Sitzplätze:</strong> {b.seats}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Gebucht am:</strong> {new Date(b.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
