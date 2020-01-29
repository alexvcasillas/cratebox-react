![Cratebox React Logo](https://raw.githubusercontent.com/alexvcasillas/cratebox-react/master/logo/cratebox-react-logo.jpg)

[Cratebox](https://github.com/alexvcasillas/cratebox) bindings for [React](https://github.com/facebook/react) in just **818B** of gzipped code (2.02KB bundle).

# Contents

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Create Context](#create-context)
* [React Hooks](#react-hooks)

# Installation

NPM

```sh
npm install cratebox-react
```

Yarn

```sh
yarn add cratebox-react
```

# Getting Started

To get started with **Cratebox React** first of all you need to import the dependency into your project plus [cratebox: ^2.1.0](https://github.com/alexvcasillas/cratebox)

Note: [React 16.12.x](https://github.com/facebook/react) is a peer dependency of this project, meaning that, without the React library, **Cratebox React** won't work and therefore, you need to have it as a depencendy of your project.


```js
import React from 'react';
// Import our cratebox stuff
import { createStore } from 'cratebox'
// Import create context and consumer
import { CrateboxProvider } from 'cratebox-react';

export type UserState = {
  name: string;
  lastName: string;
};

export type UserViews = {
  fullName: string;
};

export type UserActions = {
  changeName: (name: string) => void;
  changeLastName: (lastName: string) => void;
};

export type Store = {
  state: UserState;
  views?: UserViews;
  actions?: UserActions;
};

const userState: UserState = {
  name: "Alex",
  lastName: "Casillas"
};

const userViews = (state: UserState): UserViews => ({
  fullName: `${state.name} ${state.lastName}`
});

const userActions = (state: UserState): UserActions => ({
  changeName(name: string) {
    state.name = name;
  },
  changeLastName(lastName: string) {
    state.lastName = lastName;
  }
});

const userStore = createStore(userState, userViews, userActions);

const stores = [
  { id: 'user-store', store: userStore },
];

// Now you can make use of your cratebox at your app this way.
const App = () => (
  <CrateboxProvider stores={stores}>
    ...
  </CrateboxProvider>
);
```

## React Hooks

### useStore

```typescript
useStore<StateType, ViewsType, ActionsType>(store: string): { state, view, actions }
```

_Note: The code bellow is based on the example from above._

the `useStore` hook requires the name of the store you'd like to connect to. After that, it will return you an object with the `state`, `views` and `actions` that are declared on your store

```jsx
import React from "react";
import { useStore } from "cratebox-react";
import { UserState, UserViews, UserActions } from "types/types.file";

export function User() {
  const { state, views, actions } = useStore<UserState, UserViews, UserActions>(
    "user-store"
  );

  return (
    <>
      <h3>Hello {views.fullName}</h3>
      <button
        onClick={() =>
          actions.changeName(state.name === "Alex" ? "John" : "Alex")
        }
      >
        Wanna change your name through an action?
      </button>
      <button
        onClick={() => {
          // This will "throw and break your app" because it's a manual set
          try {
            state.name = "John";
          } catch (error) {
            console.log(error.message);
          }
        }}
      >
        Or better force change your name?
      </button>
    </>
  );
}
```

### useActions

If on the other hand, you only need to dispatch data from a component and don't want it to be rendered when data changes on the store, you can just **useActions** (no pun intended) wich is like **useStore** but simpler due to it only takes actions types and store identifier and returns the actions of the given store. 

```jsx
import React from "react";
import { useStore, useActions } from "cratebox-react";
import { UserActions } from "types/types.file";

export function User() {
  const { actions } = useActions<UserActions>("user-store");

  return (
    <button
      onClick={() =>
        actions.changeName(state.name === "Alex" ? "John" : "Alex")
      }
    >
      Change name on the store but don't re-render this component
    </button>
  );
}
```