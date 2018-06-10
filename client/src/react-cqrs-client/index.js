import React, { Component } from "react";

export const ClientContext = React.createContext("react-cqrs");

export const createClient = port => ({
    runQuery: (query, done, error) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `http://localhost:${port}?${Object.keys(query)
                .map(key => `${key}=${query[key]}`)
                .join("&")}`
        );

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                done(xhr.response);
            }
        };

        xhr.send();
    }
});

export const withQuery = query => WrappedComponent => {
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

    return props => <ClientContext.Consumer>
        {client => <Wrapper {...props} client={client} />}
    </ClientContext.Consumer>;
};
