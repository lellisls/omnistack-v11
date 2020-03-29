const client = require("../services/ElasticSearchClient");
const connection = require("../database/connection");

module.exports = {
  async searchIncidents(request, response) {
    const { query } = request.query;

    try {
      const { body } = await client.search(
        {
          index: "incidents",
          body: {
            query: {
              multi_match: {
                query,
                fields: ["title", "name", "description", "city", "uf"]
              }
            }
          }
        },
        {
          ignore: [404],
          maxRetries: 3
        }
      );

      if (!body || body.hits.total.value == 0) {
        return response.json([]);
      }

      const incidents = await connection("incidents")
        .join("ongs", "ongs.id", "=", "incidents.ong_id")
        .whereIn(
          "incidents.id",
          body.hits.hits.map(incident => incident._id)
        )
        .select([
          "incidents.*",
          "ongs.name",
          "ongs.email",
          "ongs.whatsapp",
          "ongs.city",
          "ongs.uf"
        ]);

      console.log(incidents);
      response.json(incidents);
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        error: err.message,
        detail: err
      });
    }
  },
  async searchOngs(request, response) {
    const { query } = request.query;

    try {
      const { body } = await client.search(
        {
          index: "ongs",
          body: {
            query: {
              multi_match: {
                query,
                fields: ["name", "email", "city", "uf"]
              }
            }
          }
        },
        {
          ignore: [404],
          maxRetries: 3
        }
      );

      if (!body || body.hits.total.value == 0) {
        return response.json([]);
      }

      const ongs = await connection("ongs")
        .whereIn(
          "id",
          body.hits.hits.map(ong => ong._id)
        )
        .select("*");

      console.log(ongs);
      response.json(ongs);
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        error: err.message,
        detail: err
      });
    }
  }
};
