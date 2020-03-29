const connection = require("../database/connection");

const generateUniqueId = require("../utils/generateUniqueId");
const client = require("../services/ElasticSearchClient");

module.exports = {
  async index(request, response) {
    const ongs = await connection("ongs").select("*");

    return response.json(ongs);
  },
  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body;

    if (!name || !email || !whatsapp || !city || !uf) {
      response.status(422).json({ error: "Missing parameters." });
    }

    const id = generateUniqueId();

    await connection("ongs").insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf
    });

    await client.index({
      index: "ongs",
      id,
      body: {
        id,
        name,
        email,
        whatsapp,
        city,
        uf
      }
    });

    await client.indices.refresh({ index: "ongs" });

    return response.json({ id });
  }
};
