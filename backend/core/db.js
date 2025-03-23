import nano from "nano";

// ✅ CouchDB-Verbindung mit deinen Zugangsdaten
const couchDBUrl = "http://admin:passwort1234@127.0.0.1:5984"; // Deine CouchDB URL
const couch = nano(couchDBUrl);

// ✅ Definiere die Datenbanken
const eventDB = couch.use("events");

// Funktion zum Abrufen einer Datenbank (oder Erstellen, falls sie nicht existiert)
async function getDatabase(dbName) {
  try {
    const dbs = await couch.db.list();
    if (!dbs.includes(dbName)) {
      await couch.db.create(dbName);
      console.log(`✅ Datenbank "${dbName}" wurde erstellt.`);
    }
    return couch.use(dbName);
  } catch (err) {
    console.error(`❌ Fehler beim Zugriff auf die Datenbank "${dbName}": ${err.message}`);
    throw err;
  }
}

// 🛠 Datenbanken erstellen (falls nicht vorhanden)
async function initializeDatabases() {
  try {
    const dbs = await couch.db.list();
    
    // Events Datenbank
    if (!dbs.includes("events")) {
      await couch.db.create("events");
      console.log(`✅ Datenbank "events" wurde erstellt.`);
    }
    
    // Users Datenbank
    if (!dbs.includes("users")) {
      await couch.db.create("users");
      console.log(`✅ Datenbank "users" wurde erstellt.`);
      
      // Indizes für die users Datenbank erstellen (für email Suche)
      const usersDB = couch.use("users");
      await usersDB.createIndex({
        index: { fields: ["email"] },
        name: "email-index"
      });
      console.log(`✅ Index für "users" Datenbank wurde erstellt.`);
    }
  } catch (err) {
    console.error(`❌ Fehler beim Erstellen der Datenbanken: ${err.message}`);
  }
}

// **Datenbank beim Start initialisieren**
initializeDatabases();

export { eventDB, getDatabase };