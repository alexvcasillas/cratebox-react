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

  return { Provider };
}

class CrateConsumer extends React.Component {
  constructor(props) {
    super(props);
    const { cratebox, store } = this.props;
    this.cratebox = cratebox;
    this.state = this.cratebox.getState(store)
      ? this.cratebox.getState(store)
      : {};
  }

  componentDidMount() {
    const { store } = this.props;
    this.cratebox.subscribe(store, model => {
      this.setState(
        () => ({ ...model }),
      );
    });
  }

  render() {
    const { children, cratebox } = this.props;
    return React.cloneElement(children, { cratebox, ...this.state });
  }
}

export class Consumer extends React.Component {
  render() {
    const { children, store } = this.props;
    return (
      <ReactConsumer>
        {cratebox => {
          return (
            <CrateConsumer store={store} cratebox={cratebox}>
              {children}
            </CrateConsumer>
          );
        }}
      </ReactConsumer>
    );
  }
}
