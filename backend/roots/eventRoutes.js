import { getEvents, addEvent, bookEvent } from "../core/eventStore.js";

export default async function eventRoutes(fastify, options) {
  fastify.get("/events", async (request, reply) => {
    try {
      const events = await getEvents();
      return { events };
    } catch (error) {
      reply.status(500).send({ error: "Fehler beim Abrufen der Events" });
    }
  });

  fastify.post("/events", async (request, reply) => {
    const eventData = request.body;

    if (!eventData.title || !eventData.capacity || eventData.capacity <= 0) {
      return reply.status(400).send({ error: "Ungültige Eingabe: Kapazität muss größer als 0 sein." });
    }

    try {
      const result = await addEvent(eventData);
      reply.status(201).send({ message: "Event hinzugefügt!", id: result.id });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // ✅ Route für das Buchen eines Events
  fastify.post("/events/book", async (request, reply) => {
    const { eventId } = request.body;
    if (!eventId) {
      return reply.status(400).send({ error: "Event ID erforderlich!" });
    }
    try {
      const result = await bookEvent(eventId);
      if (result.success) {
        reply.send({ message: "Buchung erfolgreich!", updatedEvent: result.updatedEvent });
      } else {
        reply.status(400).send({ error: result.error });
      }
    } catch (error) {
      reply.status(500).send({ error: "Fehler beim Buchen des Events" });
    }
  });
}
