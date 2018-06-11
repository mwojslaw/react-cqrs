import React, { Component } from "react";

export const ClientContext = React.createContext("react-cqrs");

export const createClient = port => ({
  runQuery: (query, done, error) =>
    fetch(
      `http://localhost:${port}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join("&")}`
    ).then(response => response.json())
});

export const withQuery = query => WrappedComponent => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: undefined,
        inProgress: true
      };
    }

    runQuery() {
      const { client } = this.props;
      this.setState({
        inProgress: true
      });
      client.runQuery(query(this.props)).then(({ data }) =>
        this.setState({
          data,
          inProgress: false
        })
      );
    }

    componentDidMount() {
      this.runQuery();
    }

    componentDidUpdate(prevProps) {
      if (prevProps !== this.props) this.runQuery();
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  return props => (
    <ClientContext.Consumer>
      {client => <Wrapper {...props} client={client} />}
    </ClientContext.Consumer>
  );
};
