"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin, isAuthenticated } from "@/lib/authUtils";

export default function EventsCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  // Überprüfe Admin-Status beim Laden der Seite
  useEffect(() => {
    // Kurze Verzögerung zur Simulation des Ladevorgangs
    const checkAdminStatus = () => {
      const adminStatus = isAdmin();
      const isLoggedIn = isAuthenticated();
      
      setIsUserAdmin(adminStatus);
      setIsLoading(false);
      
      // Wenn nicht eingeloggt oder kein Admin, zurück zur Startseite
      if (!isLoggedIn) {
        router.push('/auth/login?redirectTo=/events/create');
      } else if (!adminStatus) {
        setError("Du hast keine Berechtigung, Events zu erstellen.");
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };
    
    // Führe die Prüfung nach kurzer Verzögerung aus
    const timer = setTimeout(checkAdminStatus, 500);
    
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Überprüfe erneut, ob der Benutzer Admin ist
    if (!isAdmin()) {
      setError("Du hast keine Berechtigung, Events zu erstellen.");
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    if (!title || !capacity || !date || !location || !category) {
      setError("Bitte fülle alle erforderlichen Felder aus.");
      return;
    }

    const eventData = {
      title,
      capacity: Number(capacity),
      date,
      location,
      category,
      short_description: shortDescription,
      long_description: longDescription,
      tags: tags.split(",").map((tag) => tag.trim()),
      createdBy: JSON.parse(localStorage.getItem('user') || '{}')._id,
      createdAt: new Date().toISOString()
    };

    try {
      setIsLoading(true);
      
      const response = await fetch("http://127.0.0.1:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fehler beim Speichern der Daten");
      }

      // Event erfolgreich erstellt, leite zur Event-Liste weiter
      router.push('/events?created=true');
    } catch (error) {
      console.error("Fehler beim Speichern des Events:", error);
      setError(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten");
      setIsLoading(false);
    }
  };

  // Wenn die Seite noch lädt, zeige Ladeanzeige
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Einen Moment bitte...</p>
        </div>
      </div>
    );
  }

  // Wenn der Benutzer kein Admin ist, zeige Fehlermeldung
  if (!isUserAdmin) {
    return (
      <div className="container mx-auto p-6 mt-20">
        <div className="bg-red-900/30 border-l-4 border-red-500 text-red-300 p-4 rounded">
          <p className="font-medium">Zugriff verweigert</p>
          <p>{error || "Du hast keine Berechtigung, diese Seite aufzurufen."}</p>
          <p className="mt-2 text-sm">Du wirst zur Startseite weitergeleitet...</p>
        </div>
      </div>
    );
  }

  // Formular für Admins anzeigen
  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold text-white mb-6">Neues Event erstellen</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-500 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-white">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Kapazität</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Ort</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="Workshop">Workshop</option>
            <option value="Weiterbildung">Weiterbildung</option>
            <option value="Networking">Networking</option>
            <option value="Sport">Sport</option>
            <option value="Konzert">Konzert</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white">Kurzbeschreibung</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Eventbeschreibung</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white min-h-20"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Tags (durch Komma getrennt)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 rounded bg-background border border-gray-700/50 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-gray-600' : 'bg-primary hover:bg-secondary'
          } text-white p-3 rounded shadow-md font-medium transition-colors`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="spinner-sm mr-2"></span>
              Wird erstellt...
            </span>
          ) : (
            "Event erstellen"
          )}
        </button>
      </form>
    </div>
  );
}