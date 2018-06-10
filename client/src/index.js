import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { createClient, withQuery, ClientContext } from "./react-cqrs-client";

const App = ({ data }) => <div>hello {data}</div>;

const GET_USER_NAME_QUERY = "GET_USER_NAME_QUERY";

const getUserNameQuery = ({ userId }) => ({
  type: GET_USER_NAME_QUERY,
  id: userId
});

const UserQuery = withQuery(getUserNameQuery)(({ data, children }) =>
  children({ data })
);

const User = ({ name }) => <div>{name}</div>;

ReactDOM.render(
  <ClientContext.Provider value={createClient(9000)}>
    <UserQuery userId={1}>{({ data }) => <User name={data} />}</UserQuery>
  </ClientContext.Provider>,
  document.getElementById("root")
);
