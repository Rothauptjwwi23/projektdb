import { getDatabase } from "./db.js";
import { bookEvent } from "./eventStore.js";

export const addBooking = async (user_id, event_id, seats = 1) => {
    console.log("🔁 Neue Buchung:", { user_id, event_id, seats });
  
    const bookingsDb = await getDatabase("bookings");
  
    const booking = {
      user_id,
      event_id,
      seats,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      type: "booking",
    };
  
    const eventResult = await bookEvent(event_id, seats);
    if (!eventResult.success) {
      console.error("❌ Fehler beim Reduzieren der Plätze:", eventResult.error);
      throw new Error(eventResult.error);
    }
  
    const result = await bookingsDb.insert(booking);
    console.log("✅ Buchung gespeichert:", result);
    return { ...booking, _id: result.id };
  };
  

export const getBookingsByUser = async (user_id) => {
    const bookingsDb = await getDatabase("bookings");
    const eventsDb = await getDatabase("events");
  
    const result = await bookingsDb.find({
      selector: {
        user_id,
        type: "booking",
      },
      sort: [{ createdAt: "desc" }],
    });
  
    const enrichedBookings = await Promise.all(
      result.docs.map(async (booking) => {
        try {
          const event = await eventsDb.get(booking.event_id);
          return { ...booking, event }; // ✅ Event-Daten anhängen
        } catch (err) {
          console.warn("Kein Event gefunden für:", booking.event_id);
          return booking;
        }
      })
    );
  
    return enrichedBookings;
  };
  