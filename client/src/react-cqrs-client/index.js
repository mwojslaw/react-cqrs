import React, { Component } from "react";

export const ClientContext = React.createContext("react-cqrs");

export const createClient = port => ({
  runQueries: (...queries) => {
    const params = queries
      .map(query => `query[]=${JSON.stringify(query)}`)
      .join("&");
    return fetch(`http://localhost:${port}?${params}`).then(response =>
      response.json()
    );
  },
  runCommand: command =>
    fetch(`http://localhost:${port}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command)
    }).then(response => response.json())
});

const without = propName => object =>
  Object.keys(object)
    .filter(key => key !== propName)
    .reduce((pv, cv) => ({ ...pv, [cv]: object[cv] }), {});

const withoutChildren = without("children");

export const withQuery = (...queries) => WrappedComponent => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: undefined,
        inProgress: true
      };
    }

    runQueries() {
      const { client } = this.props;
      this.setState({
        inProgress: true
      });
      client.runQueries(queries.map(q => q(this.props))).then(({ data }) =>
        this.setState({
          data: data.lenght > 1 ? data : data[0],
          inProgress: false
        })
      );
    }

    componentDidMount() {
      this.runQueries();
    }

    componentDidUpdate(prevProps) {
      if (
        JSON.stringify(withoutChildren(prevProps)) !==
        JSON.stringify(withoutChildren(this.props))
      )
        this.runQueries();
    }

    render() {
      return (
        <WrappedComponent
          run={props => this.runQueries()}
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
