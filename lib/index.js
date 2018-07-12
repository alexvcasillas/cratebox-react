import React from "react";

const { Provider: ReactProvider, Consumer: ReactConsumer } = React.createContext();

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

export function createContext(cratebox) {
  if (typeof cratebox === "undefined") {
    throw new Error(`You must provide a cratebox instance to the createCrateProvider function`);
  }
  const Provider = ({ children }) => <ReactProvider value={cratebox}>{children}</ReactProvider>;

  return { Provider };
}

class CrateConsumer extends React.Component {
  constructor(props) {
    super(props);
    const { cratebox, store } = this.props;
    this.cratebox = cratebox;
    this.state = {};
    if (isArray(store)) {
      store.forEach(storeToSubscribe => {
        if (hasProp.call(this.state, storeToSubscribe)) {
          throw new Error(`You cannot subscribe more than once to the same store in the same consumer`);
        }
        this.state[storeToSubscribe] = this.cratebox.getState(storeToSubscribe) || {};
      });
    } else {
      this.state[store] = this.cratebox.getState(store) || {};
    }
    this.cancelSubscriptions = {};
  }

  componentDidMount() {
    const { store } = this.props;
    if (isArray(store)) {
      store.forEach(storeToSubscribe => {
        this.cancelSubscriptions[storeToSubscribe] = this.cratebox.subscribe(storeToSubscribe, model => {
          const stateObject = {};
          stateObject[storeToSubscribe] = { ...model };
          this.setState(() => stateObject);
        });
      });
    } else {
      this.cancelSubscriptions[store] = this.cratebox.subscribe(store, model => {
        const stateObject = {};
        stateObject[store] = { ...model };
        this.setState(() => stateObject);
      });
    }
  }

  componentWillUnmount() {
    keyList(this.cancelSubscriptions).forEach(subscription => subscription());
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
