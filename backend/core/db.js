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

export { eventDB };
