// Verwenden von require für die Module
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const eventRoutes = require('./roots/eventRoutes.js'); // Importiere eventRoutes mit require

const fastify = Fastify({ logger: true });

// CORS aktivieren
fastify.register(cors, {
  origin: "*", // Alle Ursprünge erlauben
  methods: ["GET", "POST"],
});

// **Route für den Root-Pfad hinzufügen**
fastify.get("/", async (request, reply) => {
  return { message: "Willkommen beim Event-Buchungssystem!" };
});

// **Route für Events registrieren**
fastify.register(eventRoutes);

// Server starten
const startServer = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("✅ Server läuft auf http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Starte den Server
startServer();
