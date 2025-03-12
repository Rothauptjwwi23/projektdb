const { getEvents, addEvent, bookEvent } = require("../core/eventStore.js");

// 📌 GET: Alle Events abrufen
const eventRoutes = async (fastify, options) => {
  fastify.get("/events", async (request, reply) => {
    try {
      const events = await getEvents();
      return { events };
    } catch (error) {
      return reply.status(500).send({ error: "Fehler beim Abrufen der Events" });
    }
  });

  fastify.post("/events", async (request, reply) => {
    const eventData = request.body;
    const result = await addEvent(eventData);
    if (result.success) {
      return { message: "Event erfolgreich hinzugefügt!", id: result.id };
    } else {
      return reply.status(400).send({ error: result.error });
    }
  });

  fastify.post("/events/book", async (request, reply) => {
    const { eventId } = request.body;
    if (!eventId) {
      return reply.status(400).send({ error: "Event ID ist erforderlich!" });
    }

    const result = await bookEvent(eventId);
    if (result.success) {
      return { message: "Buchung erfolgreich!", event: result.event };
    } else {
      return reply.status(400).send({ error: result.message || result.error });
    }
  });
};

// Exportiere die eventRoutes
module.exports = eventRoutes;
