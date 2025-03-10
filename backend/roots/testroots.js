// src/roots/testroots.js
import { getData, addData } from '../core/dataStore.js';

export default async function testroots(fastify, options) {
    // GET: Gibt alle gespeicherten Daten zurück
    fastify.get('/data', async (request, reply) => {
        return { data: getData() };
    });

    // POST: Fügt neue Daten hinzu
    fastify.post('/data', async (request, reply) => {
        const { name, value } = request.body;
        if (!name || !value) {
            return reply.status(400).send({ error: 'Name and value are required' });
        }

        const newEntry = { id: Date.now(), name, value };
        addData(newEntry);

        return { message: 'Data added', entry: newEntry };
    });
}
