const express = require("express");
const app = express();
const cors = require("cors");
const cqrs = require("./react-cqrs-server");

const queries = [
  {
    type: "GET_USER_NAME_QUERY",
    handler: ({ id }) => `Maciej: ${id}`
  }
];

const queryProcessor = cqrs.createQueryProcessor(queries);

app.use(cors());

app.get("/", cqrs.withQuery(queryProcessor, "GET_USER_NAME_QUERY"));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
