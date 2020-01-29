/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

const CrateboxReactContext = createContext([]);

export function CrateboxProvider({ stores, children }) {
  return (
    <CrateboxReactContext.Provider value={stores}>
      {children}
    </CrateboxReactContext.Provider>
  );
}

type BaseStore = {
  state: any;
  views: any;
  actions: any;
  subscribe: (listener: any) => () => void;
};

type StoreInContext<T> = {
  id: string;
  store: BaseStore & T;
};

export function useStore<T, V, A>(store: string) {
  const _stores: StoreInContext<T>[] = useContext(CrateboxReactContext);
  const [, setState] = useState<T>({} as T);
  const storeRef = useRef<T>({} as T);
  const storeState = useRef<T>({} as T);
  const storeViews = useRef<V>({} as V);
  const storeActions = useRef<A>({} as A);

  useEffect(() => {
    let chosenStore: BaseStore & T | null = null;
    const amountOfStores = _stores.length;
    let found = false;
    for (let i = 0; i < amountOfStores && !found; i++) {
      if (_stores[i].id === store) {
        chosenStore = _stores[i].store;
        found = true;
      }
    }
    storeRef.current = chosenStore as T;
    storeState.current = chosenStore && chosenStore.state;
    storeViews.current = chosenStore && chosenStore.views;
    storeActions.current = chosenStore && chosenStore.actions;
    if (chosenStore && chosenStore.state) setState({ ...chosenStore.state });
    const subscription = chosenStore && chosenStore.subscribe(setState);
    return () => {
      if (subscription) subscription(); // Unsubscribe
    };
  }, []);

  return {
    state: storeState.current,
    views: storeViews.current,
    actions: storeActions.current
  };
}
