import { getDatabase } from "./db.js";
import { bookEvent } from "./eventStore.js";

export const addBooking = async (user_id, event_id, seats = 1) => {
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
  if (!eventResult.success) throw new Error(eventResult.error);

  const result = await bookingsDb.insert(booking);
  return { ...booking, _id: result.id };
};
