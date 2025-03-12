import { eventDB } from "./db.js";

// 📌 Funktion zum Abrufen aller Events
export const getEvents = async () => {
  try {
    const events = await eventDB.list({ include_docs: true });
    return events.rows.length ? events.rows.map(row => row.doc) : [];
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Events:", error);
    return [];
  }
};

// 📌 Funktion zum Hinzufügen eines neuen Events
export const addEvent = async (eventData) => {
  try {
    const response = await eventDB.insert(eventData);
    return { success: true, id: response.id };
  } catch (error) {
    console.error("❌ Fehler beim Hinzufügen eines Events:", error);
    return { success: false, error: error.message };
  }
};

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
