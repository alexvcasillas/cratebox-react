![Cratebox React Logo](https://raw.githubusercontent.com/alexvcasillas/cratebox-react/master/logo/cratebox-react-logo.jpg)

[Cratebox](https://github.com/alexvcasillas/cratebox) bindings for [React](https://github.com/facebook/react) in just **818B** of gzipped code (2.02KB bundle).

# Contents

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Create Context](#create-context)
* [Cratebox Consumer](#cratebox-consumer)
* [React Hook](#react-hook)

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

To get started with **Cratebox React** first of all you need to import the dependency into your project plus [Cratebox](https://github.com/alexvcasillas/cratebox)

Note: [React 16.3.x](https://github.com/facebook/react) is a peer dependency of this project, meaning that, without the React library, **Cratebox React** won't work and therefore, you need to have it as a depencendy of your project.


```js
import React from 'react';
// Import our cratebox stuff
import { cratebox, types } from 'cratebox'
// Import create context and consumer
import { createContext, Consumer } from 'cratebox-react';
// Instantiate CrateBox
const crate = cratebox();

// Describe a store
crate.describeStore({
  identifier: "user",
  model: {
    name: types.string,
    lastName: types.string,
    age: types.number
  }
});

// Let's describe another store for the sake of the example
crate.describeStore({
  identifier: "posts",
  model: {
    entries: types.array(types.string)
  }
});

// Instantiate the provider
const { Provider } = createContext(crate);

// Dummy test component for didactic purposes
class TestComponent extends React.Component {
  updateUser = () => {
    const { cratebox } = this.props;
    cratebox.dispatch({
      identifier: "user",
      model: {
        name: "Alex",
        lastName: "Casillas"
      }
    });
  };
  updateAge = () => {
    const { cratebox } = this.props;
    cratebox.dispatch({
      identifier: "user",
      model: {
        age: 28
      }
    });
  };

  render() {
    const { name, lastName, age } = this.props;
    return (
      <React.Fragment>
        <div>
          {name || lastName || age
            ? `${name} ${lastName} has ${
                age ? `${age} years old` : "not defined his age"
              }`
            : "No user"}
        </div>
        <React.Fragment>
          <button style={{ cursor: "pointer" }} onClick={this.updateUser}>
            Set an user
          </button>
          <button style={{ cursor: "pointer" }} onClick={this.updateAge}>
            Update Age
          </button>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

// Dummy test component for didactic purposes
class PostsComponent extends React.Component {
  deletePost = id => {
    const { cratebox, entries } = this.props;
    cratebox.dispatch({
      identifier: "posts",
      model: {
        entries: entries.filter((post, i) => i !== id)
      }
    });
  };
  render() {
    const { entries } = this.props;
    return !entries
      ? null
      : entries.map((post, i) => (
          <div key={i}>
            {post} <button onClick={() => this.deletePost(i)}>x</button>
          </div>
        ));
  }
}


// Now you can make use of your cratebox at your app this way.
const App = () => (
  <Provider cratebox={crate}>
    <React.Fragment>
      <Consumer store="user">
        <TestComponent />
      </Consumer>
      <Consumer store="posts">
        <PostsComponent />
      </Consumer>
    </React.Fragment>
  </Provider>
);
```

## Create Context

The create context function is the one in charge of giving you back the provider based on a [Cratebox](https://github.com/alexvcasillas/cratebox) passed as the single argument.

When create context is called with a [Cratebox](https://github.com/alexvcasillas/cratebox) (with or without descriptions) it will return you a React Component called **Provider**.

This **Provider** element will take a single prop called `cratebox` that, even though it's obvious, will be your previously created [Cratebox](https://github.com/alexvcasillas/cratebox).

This **Provider** will be in charge of passing all that it's needed to the consumers you specify so you can access cratebox anywhere in your application.

## Cratebox Consumer

To make use of the **Cratebox Consumer** you need to import it in your project from the `cratebox-react` package.

This is a React Component that will be in charge of consuming and subscribing to changes of a specific store described in your [Cratebox](https://github.com/alexvcasillas/cratebox).

The **Cratebox Consumer** Component takes on single prop called `store`, and this will be the `identifier` of the store you would like to subscribe to within this particular component or an array with the identifiers that you would like to subscribe to.

Within **Cratebox Consumer**'s direct children you'll have access to the full API of [Cratebox](https://github.com/alexvcasillas/cratebox) so you can dispatch changes to any store or even subscribe to other stores if you would like so. You'll have access to all of the subscribed model properties everytime it changes and you will be able to do Time Traveling and all of the awesome features that comes out of the box with [Cratebox](https://github.com/alexvcasillas/cratebox).

The **Cratebox Consumer** as two ways of being used:

1. Higher Order Component.
2. Functional Children Component.

The Higher Order Component will be used like the following:

```html
<Consumer store="user">
  <TestComponent />
</Consumer>
```

User store will be pased as props to `TestComponent`.

The Functional Children Component is a more direct (you pass a prop called direct, no pun intended) approach of using **Cratebox React** and it's the recommended way of using it (if not using hooks, of course) and will be used like the following:

```jsx
<Consumer store="user" direct>
{({ cratebox, state }) => (
  <>
    <div>My name is: {state.name}</div>
    <input
      type="text"
      value={state.name}
      onChange={e => {
        cratebox.dispatch({
          identifier: "user",
          model: {
            name: e.target.value
          }
        })
      }
    />
  </>
)}
</Consumer>
```

## React Hook

With the 2.0 version and onwards you can make use of the `useStore` hook! With this hook you can make things even more easy to deal with. This is the signature of the hook:

```js
useStore(store: string): { state: modelObject, dispatch: Function }
```

the `useStore` hook requires the name of the store you'd like to connect to. After that, it will return you an object with the `state` and `dispatch` properties.

The `state` property is nothing less than the model of the store itself with its latests values.

The `dispatch` property is a function that you'll have to call whenever you want to update the model and, unlike the previous version of the dispatch from the _functional children component_ or the _higher order component_, you won't need to tell the function which store you'd be making changes to, because that's already declared when using the `useStore` hook so you'd only need to pass the model values.

```jsx
import React, { useEffect } from 'react';
import { useStore } from 'cratebox-react';

function UserComponent() {
  const { state, dispatch } = useStore('user');

  function updateState(value) {
    dispatch(value);
  }

  return (
    <>
    <div>
      {state && (
        <div>{state.name || 'John'} {state.lastName || 'Doe'} has {state.age || 'unknown'} years old.</div>
      )}
    </div>
    <div>
      <input placeholder="Name" type="text" onChange={e => updateState({ name: e.target.value })} />
      <input placeholder="Last Name" type="text" onChange={e => updateState({ lastName: e.target.value })} />
      <input placeholder="Age" type="text" onChange={e => updateState({ age: parseInt(e.target.value, 10) })} />
    </div>
    </>
  );
}

export default UserComponent;

```