import Fastify from 'fastify';
import cors from '@fastify/cors';
import eventRoutes from './roots/eventRoutes.js';
import bookingRoutes from './roots/bookingRoutes.js';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(eventRoutes);
fastify.register(bookingRoutes);

const startServer = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("✅ Server läuft auf http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
