import Fastify from "fastify";
import cors from "@fastify/cors";
import testroots from "./roots/testroots.js";

const fastify = Fastify({
  logger: true,
});

// Fix für CORS-Probleme
fastify.register(cors, {
  origin: "*",  // Erlaubt alle Ursprünge (für Entwicklung)
  methods: ["GET", "POST"],
});

fastify.register(testroots);

const startServer = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server läuft auf http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
