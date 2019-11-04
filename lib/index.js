import React, { useState, useEffect, useContext, useRef } from 'react';

const CrateboxContext = React.createContext();
const { Provider: ReactProvider, Consumer: ReactConsumer } = CrateboxContext;

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

export function createContext(cratebox) {
  if (typeof cratebox === 'undefined') {
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
      let stateObject = {};
      store.forEach(storeToSubscribe => {
        this.cancelSubscriptions[storeToSubscribe] = this.cratebox.subscribe(storeToSubscribe, model => {
          stateObject[storeToSubscribe] = { ...model };
        });
      });
      if (!this.unmounted) this.setState(() => stateObject);
    } else {
      this.cancelSubscriptions[store] = this.cratebox.subscribe(store, model => {
        /**
         * IMPORTANT
         * We have to check for this "unmounted" property because the component get's
         * unmounted after the subscription gets triggered and that's why we're getting
         * the error about calling setState on an unmounted component and therefore, a memory leak
         */
        if (!this.unmounted) {
          const stateObject = {};
          stateObject[store] = { ...model };
          this.setState(() => stateObject);
        }
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    keyList(this.cancelSubscriptions).forEach(subscription => {
      this.cancelSubscriptions[subscription]();
      delete this.cancelSubscriptions[subscription];
    });
  }

  render() {
    const { children, cratebox, direct } = this.props;
    if (direct) return children({ cratebox, state: this.state });
    return React.cloneElement(children, { cratebox, ...this.state });
  }
}

export class Consumer extends React.Component {
  render() {
    const { children, store, direct } = this.props;
    return (
      <ReactConsumer>
        {cratebox => {
          return (
            <CrateConsumer store={store} cratebox={cratebox} direct={direct}>
              {children}
            </CrateConsumer>
          );
        }}
      </ReactConsumer>
    );
  }
}

export function useStore(store) {
  const cratebox = useContext(CrateboxContext);
  const subscriptionReference = useRef(null);
  const [state, setState] = useState(cratebox.getState(store));

  useEffect(() => {
    subscriptionReference.current = cratebox.subscribe(store, model => setState(model));
    return () => {
      subscriptionReference.current();
      subscriptionReference.current = null;
    };
  }, [store]);

  function dispatchHook(model) {
    cratebox.dispatch({
      identifier: store,
      model
    });
  }

  return {
    state,
    dispatch: dispatchHook
  }
}

export function useDispatch(store) {
  const cratebox = useContext(CrateboxContext);

  function dispatch(model) {
    cratebox.dispatch({
      identifier: store,
      model,
    });
  }

  return {
    dispatch
  }
}