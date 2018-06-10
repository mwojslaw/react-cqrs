const express = require("express");
const app = express();
const cors = require("cors");

const createQueryProcessor = queries => ({
  runQuery: (type, params) => queries.find(q => q.type === type).handler(params)
});

const queries = [
  {
    type: "GET_USER_NAME_QUERY",
    handler: ({ id }) => `Maciej: ${id}`
  }
];

const queryProcessor = createQueryProcessor(queries);

const withQuery = (queryProcessor, type) => (req, res) => {
  const { query } = req;

  res.send(queryProcessor.runQuery(query.type, query));
};

app.use(cors());

app.get("/", withQuery(queryProcessor, "GET_USER_NAME_QUERY"));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
