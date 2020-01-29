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
  // @ts-ignore because it's not going to be undefined dear typscript...
  const [state, setState] = useState<T>(_stores.find(s => s.id === store).store.state);
  // @ts-ignore because it's not going to be undefined dear typscript...
  const storeRef = useRef<BaseStore & T>(_stores.find(s => s.id === store).store);
  // @ts-ignore because it's not going to be undefined dear typscript...
  const storeViews = useRef<V>(_stores.find(s => s.id === store).store.views);
  // @ts-ignore because it's not going to be undefined dear typscript...
  const storeActions = useRef<A>(_stores.find(s => s.id === store).store.actions);

  useEffect(() => {
    const subscription = storeRef.current.subscribe((data: T) => setState({ ...data }));
    return () => {
      if (subscription) subscription(); // Unsubscribe
    };
  }, []);

  return {
    state: state,
    views: storeViews.current,
    actions: storeActions.current
  };
}

export function useActions<A>(store: string) {
  const _stores: StoreInContext<BaseStore>[] = useContext(CrateboxReactContext);
  // @ts-ignore because it's not going to be undefined dear typscript...
  const storeActions = useRef<A>(_stores.find(s => s.id === store).store.actions);

  return {
    actions: storeActions.current
  };
}