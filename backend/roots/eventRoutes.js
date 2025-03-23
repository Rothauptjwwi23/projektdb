// Pfad: backend/roots/eventRoutes.js

import { getEvents, addEvent, bookEvent } from "../core/eventStore.js";
import jwt from "jsonwebtoken";

const checkAdminRole = async (request, reply, done) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Kein Authentifizierungstoken gefunden" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "Geheim_Key_1234");

    if (!decoded.user || decoded.user.role !== "admin") {
      return reply.status(403).send({ error: "Zugriff verweigert. Nur Administratoren können Events erstellen." });
    }

    request.user = decoded.user;
    done();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return reply.status(401).send({ error: "Ungültiges Token" });
    }
    return reply.status(500).send({ error: "Interner Serverfehler bei der Authentifizierung" });
  }
};

export default async function eventRoutes(fastify, options) {
  fastify.get("/events", async (request, reply) => {
    try {
      // Neue Filter-Parameter aus der Query lesen
      const { search, location, date, category } = request.query;

      // Zunächst alle Events abrufen
      let events = await getEvents();

      // Falls "search" vorhanden ist, in Titel, Location oder Tags suchen
      if (search && search.trim() !== "") {
        const s = search.toLowerCase();
        events = events.filter((e) => {
          const inTitle = e.title?.toLowerCase().includes(s);
          const inLocation = e.location?.toLowerCase().includes(s);
          const inTags =
            Array.isArray(e.tags) &&
            e.tags.some((tag) => tag.toLowerCase().includes(s));
          return inTitle || inLocation || inTags;
        });
      }

      // Location-Filter
      if (location && location.trim() !== "") {
        const loc = location.toLowerCase();
        events = events.filter((e) =>
          e.location?.toLowerCase().includes(loc)
        );
      }

      // Datums-Filter (genauer Vergleich, wenn z. B. "YYYY-MM-DD" vorliegt)
      if (date && date.trim() !== "") {
        events = events.filter((e) => e.date === date);
      }

      // Kategorie-Filter (hier "category" genannt, aber im Event heißt das Feld "type")
      if (category && category.trim() !== "") {
        events = events.filter((e) => e.type === category);
      }

      return { events };
    } catch (error) {
      reply.status(500).send({ error: "Fehler beim Abrufen der Events" });
    }
  });

  fastify.post("/events", async (request, reply) => {
    const eventData = request.body;

    const requiredFields = [
      "title",
      "capacity",
      "date",
      "location",
      "type", // Unverändert
      "short_description",
      "long_description",
    ];

    for (const field of requiredFields) {
      if (
        !eventData[field] ||
        (typeof eventData[field] === "string" && eventData[field].trim() === "")
      ) {
        return reply
          .status(400)
          .send({ error: `Feld "${field}" darf nicht leer sein.` });
      }
    }

    try {
      const result = await addEvent(eventData);
      reply.status(201).send({ message: "Event hinzugefügt!", id: result.id });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  fastify.post("/events/book", async (request, reply) => {
    const { eventId } = request.body;
    if (!eventId) {
      return reply.status(400).send({ error: "Event ID erforderlich!" });
    }
    try {
      const result = await bookEvent(eventId);
      if (result.success) {
        reply.send({
          message: "Buchung erfolgreich!",
          updatedEvent: result.updatedEvent,
        });
      } else {
        reply.status(400).send({ error: result.error });
      }
    } catch (error) {
      reply.status(500).send({ error: "Fehler beim Buchen des Events" });
    }
  });
}
