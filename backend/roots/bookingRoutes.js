import { addBooking } from "../core/bookingStore.js";
import jwt from "jsonwebtoken";

export default async function bookingRoutes(fastify, options) {
  fastify.post("/bookings", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return reply.status(401).send({ error: "Nicht authentifiziert" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "Geheim_Key_1234");
      const user = decoded.user;

      const { event_id, seats = 1 } = request.body;
      if (!event_id || seats <= 0) return reply.status(400).send({ error: "Ungültige Buchungsdaten" });

      const booking = await addBooking(user._id, event_id, seats);
      reply.send({ message: "Buchung erfolgreich", booking });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Fehler bei der Buchung" });
    }
  });
}
