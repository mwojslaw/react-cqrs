import React, { Component } from "react";

export const ClientContext = React.createContext("react-cqrs");

export const createClient = port => ({
  runQuery: query =>
    fetch(
      `http://localhost:${port}?${Object.keys(query)
        .map(key => `${key}=${query[key]}`)
        .join("&")}`
    ).then(response => response.json()),
  runCommand: command =>
    fetch(`http://localhost:${port}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command)
    }).then(response => response.json())
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
      return (
        <WrappedComponent
          run={props => this.runQuery()}
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  return props => (
    <ClientContext.Consumer>
      {client => <Wrapper {...props} client={client} />}
    </ClientContext.Consumer>
  );
};

export const withCommand = command => WrappedComponent => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: undefined,
        inProgress: true
      };
    }

    runCommand(input) {
      const { client } = this.props;
      this.setState({
        inProgress: true
      });
      return client.runCommand(command(input)).then(() =>
        this.setState({
          inProgress: false
        })
      );
    }

    render() {
      return (
        <WrappedComponent
          command={props => this.runCommand(props)}
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  return props => (
    <ClientContext.Consumer>
      {client => <Wrapper {...props} client={client} />}
    </ClientContext.Consumer>
  );
};
