import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {
  createClient,
  withQuery,
  ClientContext,
  withCommand
} from "./react-cqrs-client";

const GET_TODO_ITEMS_QUERY = "GET_TODO_ITEMS_QUERY";
const SET_COMPLETED_TODOITEM_COMMAND = "SET_COMPLETED_TODOITEM_COMMAND";

const getTodoItemsQuery = ({ status }) => ({
  type: GET_TODO_ITEMS_QUERY,
  status
});

const setCompletedTodoItemCommand = ({ id, completed }) => ({
  type: SET_COMPLETED_TODOITEM_COMMAND,
  completed,
  id
});

const TodoItemsQuery = withQuery(getTodoItemsQuery)(
  ({ data, inProgress, children, run }) => {
    return children({ data, run, inProgress });
  }
);

const SetCompletedTodoItemCommand = withCommand(setCompletedTodoItemCommand)(
  ({ command, inProgress, children }) => children({ command, inProgress })
);

const TodoItem = ({ text, completed, onClick }) => (
  <div style={{ marginBottom: 30 }} onClick={onClick}>
    {text} - {completed ? "v" : "x"}
  </div>
);

class TodoItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "all"
    };
  }

  setStatus(status) {
    this.setState({
      status
    });
  }

  render() {
    return (
      <div>
        <TodoItemsQuery status={this.state.status}>
          {({ data, inProgress, run }) =>
            inProgress
              ? "Loading"
              : data.map(todoItem => (
                  <SetCompletedTodoItemCommand key={todoItem.id}>
                    {({ command, inProgress }) => (
                      <TodoItem
                        onClick={() => {
                          command({
                            id: todoItem.id,
                            completed: !todoItem.completed
                          }).then(() => run({ status: this.state.status }));
                        }}
                        key={todoItem.id}
                        {...todoItem}
                      />
                    )}
                  </SetCompletedTodoItemCommand>
                ))
          }
        </TodoItemsQuery>
        <button onClick={() => this.setStatus("all")}>All</button>
        <button onClick={() => this.setStatus("completed")}>Completed</button>
        <button onClick={() => this.setStatus("uncompleted")}>
          Uncompleted
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <ClientContext.Provider value={createClient(9000)}>
    <TodoItems />
  </ClientContext.Provider>,
  document.getElementById("root")
);
