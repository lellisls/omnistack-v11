const connection = require("../database/connection");
const client = require("../services/ElasticSearchClient");

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection("incidents").count();

    console.log(count);

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    response.header("X-Total-Count", count["count(*)"]);
    return response.json(incidents);
  },

  async create(request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const ong = await connection("ongs")
      .where("id", ong_id)
      .select(["name", "whatsapp", "city", "uf"])
      .first();

    if (!ong) {
      return response.status(401).json({
        error: "Operation not permitted."
      });
    }

    const [id] = await connection("incidents").insert({
      title,
      description,
      value,
      ong_id
    });

    const { name, whatsapp, city, uf } = ong;

    await client.index({
      index: "incidents",
      id,
      body: {
        title,
        description,
        value,
        ong_id,
        id,
        name,
        whatsapp,
        city,
        uf
      }
    });

    await client.indices.refresh({ index: "incidents" });

    return response.json({ id });
  },

  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first();

    if (incident) {
      if (incident.ong_id !== ong_id) {
        return response.status(401).json({
          error: "Operation not permitted."
        });
      }

      await connection("incidents")
        .where("id", id)
        .delete();
    }

    return response.status(204).send();
  }
};
