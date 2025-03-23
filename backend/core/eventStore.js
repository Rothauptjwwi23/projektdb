import nano from "nano";
import { getDatabase } from "./db.js";

const couchDBUrl = "http://admin:passwort1234@127.0.0.1:5984";
const couch = nano(couchDBUrl);
const eventDB = couch.use("events");

async function initializeDatabases() {
  try {
    const dbs = await couch.db.list();
    if (!dbs.includes("events")) {
      await couch.db.create("events");
      console.log(`✅ Datenbank "events" wurde erstellt.`);
    }
  } catch (err) {
    console.error(`❌ Fehler beim Erstellen der Datenbank: ${err.message}`);
  }
}
initializeDatabases();

export const getEvents = async () => {
  const response = await eventDB.list({ include_docs: true });
  return response.rows.map((row) => row.doc);
};

export const addEvent = async (eventData) => {
  const requiredFields = ["title", "capacity", "date", "location", "type", "short_description", "long_description"];
  for (const field of requiredFields) {
    if (!eventData[field] || (typeof eventData[field] === "string" && eventData[field].trim() === "")) {
      throw new Error(`Feld "${field}" darf nicht leer sein.`);
    }
  }

  const newEvent = {
    title: eventData.title,
    capacity: eventData.capacity,
    available_seats: eventData.available_seats ?? eventData.capacity,
    date: eventData.date,
    location: eventData.location,
    type: eventData.type,
    short_description: eventData.short_description,
    long_description: eventData.long_description,
    tags: eventData.tags || [],
  };

  const response = await eventDB.insert(newEvent);
  return response;
};

export const bookEvent = async (eventId, seats = 1) => {
  try {
    const event = await eventDB.get(eventId);
    if (event.available_seats >= seats) {
      event.available_seats -= seats;
      await eventDB.insert(event);
      return { success: true, updatedEvent: event };
    } else {
      return { success: false, error: "Nicht genügend freie Plätze" };
    }
  } catch (err) {
    console.error(`❌ Fehler beim Buchen: ${err.message}`);
    return { success: false, error: "Interner Fehler" };
  }
};
