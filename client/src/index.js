import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { createClient, withQuery, ClientContext } from "./react-cqrs-client";

const GET_TODO_ITEMS_QUERY = "GET_TODO_ITEMS_QUERY";

const getTodoItemsQuery = ({ status }) => ({
  type: GET_TODO_ITEMS_QUERY,
  status
});

const TodoItemsQuery = withQuery(getTodoItemsQuery)(
  ({ data, inProgress, children }) => children({ data, inProgress })
);

const TodoItem = ({ text, completed }) => (
  <div>
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
          {({ data, inProgress }) =>
            inProgress
              ? "Loading"
              : data.map(todoItem => (
                  <TodoItem key={todoItem.id} {...todoItem} />
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
