import nano from "nano";

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
    console.error(`❌ Fehler: ${err.message}`);
  }
}

initializeDatabases();

export const getEvents = async () => {
  const response = await eventDB.list({ include_docs: true });
  return response.rows.map(row => row.doc);
};

export const addEvent = async (eventData) => {
  try {
    const response = await eventDB.insert(eventData);
    return response;
  } catch (err) {
    throw err;
  }
};

export const bookEvent = async (eventId) => {
  const event = await eventDB.get(eventId);
  if (event.booked < event.seats) {
    event.booked += 1;
    await eventDB.insert(event);
    return { success: true };
  } else {
    return { success: false, error: "Keine freien Plätze mehr verfügbar!" };
  }
};
