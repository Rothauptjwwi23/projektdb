import { eventDB } from "../core/db.js";

// 📌 Funktion zum Buchen eines Events
export const bookEvent = async (eventId) => {
    try {
        const event = await eventDB.get(eventId);
        if (event.booked < event.seats) {
            event.booked += 1;
            await eventDB.insert(event);
            return { success: true, event };
        } else {
            return { success: false, message: "Keine freien Plätze mehr!" };
        }
    } catch (error) {
        console.error("❌ Fehler beim Buchen:", error);
        return { success: false, error: error.message };
    }
};

// 📌 POST-Route zum Buchen eines Events
export default async function eventRoutes(fastify, options) {
  fastify.post("/events/book", async (request, reply) => {
    const { eventId } = request.body;
    if (!eventId) {
      return reply.status(400).send({ error: "Event ID ist erforderlich!" });
    }

    const result = await bookEvent(eventId);  // Verwendet die Funktion `bookEvent`
    if (result.success) {
      return { message: "Buchung erfolgreich!", event: result.event };
    } else {
      return reply.status(400).send({ error: result.message || result.error });
    }
  });
}
