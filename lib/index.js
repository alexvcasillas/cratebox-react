import React from "react";

const {
  Provider: ReactProvider,
  Consumer: ReactConsumer
} = React.createContext();

export function createContext(cratebox) {
  if (typeof cratebox === "undefined") {
    throw new Error(
      `You must provide a cratebox instance to the createCrateProvider function`
    );
  }
  const Provider = ({ children }) => (
    <ReactProvider value={cratebox}>{children}</ReactProvider>
  );

  class Consumer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      console.log("Consumer@Constructor");
    }

    componentDidMount() {
      console.log("Consumer@ComponentDidMount");
      const { store } = this.props;
      console.log("Subscribe to store: ", store);
      this.cratebox.subscribe(store, model => {
        console.log("Change@Consumer ", model);
        this.setState(() => ({ model }));
      });
    }

    render() {
      const { children } = this.props;
      return (
        <ReactConsumer>
          {cratebox => {
            this.cratebox = cratebox;
            return React.cloneElement(children, { cratebox });
          }}
        </ReactConsumer>
      );
    }
  }

  return { Provider, Consumer };
}
