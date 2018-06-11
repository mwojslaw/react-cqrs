const express = require("express");
const app = express();
const cors = require("cors");
const cqrs = require("./react-cqrs-server");

const todoItems = [
  {
    id: "1",
    text: "Item 1",
    completed: false
  },
  {
    id: "2",
    text: "Item 2",
    completed: true
  },
  {
    id: "3",
    text: "Item 3",
    completed: false
  }
];

const queries = [
  {
    type: "GET_TODO_ITEMS_QUERY",
    handler: ({ status }) =>
      todoItems.filter(
        todoItem =>
          status === "all" || todoItem.completed === (status === "completed")
      )
  }
];

const queryProcessor = cqrs.createQueryProcessor(queries);

app.use(cors());

app.get("/", cqrs.withQuery(queryProcessor, "GET_TODO_ITEMS_QUERY"));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
