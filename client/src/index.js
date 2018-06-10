import React, { Component } from "react";
import ReactDOM from "react-dom";

const App = ({ data }) => <div>hello {data}</div>;

const GET_USER_NAME_QUERY = "GET_USER_NAME_QUERY";

const createClient = port => ({
  runQuery: (query, done, error) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `http://localhost:${port}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join("&")}`
    );

    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        done(xhr.response);
      }
    };

    xhr.send();
  }
});

const getUserNameQuery = id => ({
  type: GET_USER_NAME_QUERY,
  id
});

const withQuery = query => WrappedComponent => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: undefined
      };
    }
    componentDidMount() {
      const { client } = this.props;
      client.runQuery(query(this.props), response => {
        this.setState({
          data: response
        });
      });
    }

    render() {
      return <WrappedComponent data={this.state.data} />;
    }
  }

  return Wrapper;
};

const AppWithQuery = withQuery(({ userId }) => getUserNameQuery(userId))(App);

ReactDOM.render(
  <AppWithQuery client={createClient(9000)} userId="1" />,
  document.getElementById("root")
);
