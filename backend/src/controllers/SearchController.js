const client = require("../services/ElasticSearchClient");

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

      console.log(body);
      response.json(body);
    } catch (err) {
      return response.status(500).json({
        error: err.message
      });
    }
  }
};
