import nano from "nano";

// ✅ CouchDB-Verbindung mit deinen Zugangsdaten
const couchDBUrl = "http://admin:passwort1234@127.0.0.1:5984"; // Deine CouchDB URL
const couch = nano(couchDBUrl);

// ✅ Definiere die "events"-Datenbank
const eventDB = couch.use("events");

// 🛠 Datenbank erstellen (falls nicht vorhanden)
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

// **Datenbank beim Start initialisieren**
initializeDatabases();

export const getEvents = async () => {
  const response = await eventDB.list({ include_docs: true });
  return response.rows.map((row) => row.doc);
};

export const addEvent = async (eventData) => {
  try {
    const response = await eventDB.insert(eventData);
    return response;
  } catch (err) {
    throw err;
  }
};

// ✅ Buchungsfunktion: available_seats aktualisieren
export const bookEvent = async (eventId) => {
  try {
    const event = await eventDB.get(eventId);
    
    if (event.available_seats > 0) {
      event.available_seats -= 1;
      if (event.available_seats < 0) event.available_seats = 0; // 🛠 Verhindere negative Werte
      const updateResponse = await eventDB.insert(event);
      return { success: true, message: "Buchung erfolgreich!", updatedEvent: updateResponse };
    } else {
      return { success: false, error: "Keine freien Plätze mehr verfügbar!" };
    }
  } catch (err) {
    console.error(`❌ Fehler beim Buchen des Events: ${err.message}`);
    return { success: false, error: "Fehler beim Buchen des Events!" };
  }
};
