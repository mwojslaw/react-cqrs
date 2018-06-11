const express = require("express");
const app = express();
const cors = require("cors");
const cqrs = require("./react-cqrs-server");
const bodyParser = require("body-parser");

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

const commands = [
  {
    type: "SET_COMPLETED_TODOITEM_COMMAND",
    handler: ({ id, completed }) => {
      const todoItem = todoItems.find(todoItem => todoItem.id === id);
      todoItem.completed = completed;
    }
  }
];

const queryProcessor = cqrs.createQueryProcessor(queries);
const commandProcessor = cqrs.createCommandProcessor(commands);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", cqrs.withQuery(queryProcessor));
app.post("/", cqrs.withCommand(commandProcessor));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
