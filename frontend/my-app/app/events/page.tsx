"use client";

import { useState } from "react";

export default function EventsPage() {
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !capacity || !date || !location || !category) {
      alert("Bitte fülle alle erforderlichen Felder aus.");
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
    };

    try {
      const response = await fetch("http://127.0.0.1:3001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Fehler beim Speichern der Daten");

      alert("Event erfolgreich hinzugefügt!");
      setTitle("");
      setCapacity("");
      setDate("");
      setLocation("");
      setCategory("");
      setShortDescription("");
      setLongDescription("");
      setTags("");
    } catch (error) {
      console.error("Fehler beim Speichern des Events:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Neues Event erstellen</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-white">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Kapazität</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Ort</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
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
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Eventbeschreibung</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Tags (durch Komma getrennt)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white p-2 rounded shadow-md"
        >
          Event erstellen
        </button>
      </form>
    </div>
  );
}
