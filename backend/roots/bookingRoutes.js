import { addBooking, getBookingsByUser } from "../core/bookingStore.js";
import jwt from "jsonwebtoken";

export default async function bookingRoutes(fastify, options) {
  // Buchung erstellen
  fastify.post("/bookings", async (request, reply) => {
    try {
      console.log("📩 Anfrage an /bookings:", request.body);
  
      const authHeader = request.headers.authorization;
      if (!authHeader) return reply.status(401).send({ error: "Nicht authentifiziert" });
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "Geheim_Key_1234");
      const user = decoded.user;
  
      const { event_id, seats = 1 } = request.body;
      if (!event_id || seats <= 0) {
        console.warn("❗ Ungültige Buchungsdaten:", request.body);
        return reply.status(400).send({ error: "Ungültige Buchungsdaten" });
      }
  
      const booking = await addBooking(user._id, event_id, seats);
      reply.send({ message: "Buchung erfolgreich", booking });
    } catch (err) {
      console.error("❌ Buchungsfehler:", err);
      reply.status(500).send({ error: "Fehler bei der Buchung" });
    }
  });
  

  // Eigene Buchungen abrufen
  fastify.get("/bookings/me", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return reply.status(401).send({ error: "Nicht authentifiziert" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "Geheim_Key_1234");
      const user = decoded.user;

      const bookings = await getBookingsByUser(user._id);
      reply.send({ bookings });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Fehler beim Abrufen der Buchungen" });
    }
  });
}
