const express = require("express");
const app = express();
const cors = require("cors");
const cqrs = require("./react-cqrs-server");
const bodyParser = require("body-parser");

const users = [
  {
    id: "1",
    name: "Maciej"
  }
];

const todoItems = [
  {
    id: "1",
    userId: "1",
    text: "Item 1",
    completed: false
  },
  {
    id: "2",
    userId: "1",
    text: "Item 2",
    completed: true
  },
  {
    id: "3",
    userId: "1",
    text: "Item 3",
    completed: false
  }
];

const queries = [
  {
    type: "GET_TODO_ITEMS_QUERY",
    handler: ({ status, userId }) =>
      todoItems.filter(
        todoItem =>
          todoItem.userId === userId &&
          (status === "all" || todoItem.completed === (status === "completed"))
      )
  },
  {
    type: "GET_USER_QUERY",
    handler: ({ id }, { previous }) => users.find(u => u.id === id)
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
app.use(cqrs.cqrsMiddlewere(commandProcessor, queryProcessor));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
