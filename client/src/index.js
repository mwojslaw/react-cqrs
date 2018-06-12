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
const GET_USER_QUERY = "GET_USER_QUERY";

const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    value => value
  );

const getTodoItemsQuery = ({ status, userId }) => ({
  type: GET_TODO_ITEMS_QUERY,
  status,
  userId
});

const getUserQuery = ({ id }) => ({
  type: GET_USER_QUERY,
  id
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

const UserQuery = withQuery(getUserQuery)(
  ({ data, inProgress, children, run }) => {
    return children({ data, run, inProgress });
  }
);

const UserWithTodoItems = ({ userId, status, children }) => (
  <UserQuery id={userId}>
    {({ data: user, inProgress }) =>
      inProgress ? (
        "Loading"
      ) : (
        <TodoItemsQuery status={status} userId={userId}>
          {({ data, inProgress, run }) =>
            inProgress ? "Loading" : children({ user, items: data, run })
          }
        </TodoItemsQuery>
      )
    }
  </UserQuery>
);

const SetCompletedTodoItemCommand = withCommand(setCompletedTodoItemCommand)(
  ({ command, inProgress, children }) => children({ command, inProgress })
);

const TodoItem = ({ text, completed, onClick }) => (
  <div
    style={{
      marginBottom: 30,
      textDecoration: completed ? "line-through" : ""
    }}
    onClick={onClick}
  >
    {text} - {completed ? "v" : "x"}
  </div>
);

const User = ({ name }) => <div style={{ marginBottom: 20 }}>{name}</div>;

class App extends Component {
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
    const { userId } = this.props;
    return (
      <Fragment>
        <UserWithTodoItems userId={userId} status={this.state.status}>
          {({ user, items, run }) => (
            <Fragment>
              <User name={user.name} />
              {items.map(todoItem => (
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
              ))}
            </Fragment>
          )}
        </UserWithTodoItems>
        <button onClick={() => this.setStatus("all")}>All</button>
        <button onClick={() => this.setStatus("completed")}>Completed</button>
        <button onClick={() => this.setStatus("uncompleted")}>
          Uncompleted
        </button>
      </Fragment>
    );
  }
}

ReactDOM.render(
  <ClientContext.Provider value={createClient(9000)}>
    <App userId="1" />
  </ClientContext.Provider>,
  document.getElementById("root")
);
