![Cratebox React Logo](https://raw.githubusercontent.com/alexvcasillas/cratebox-react/master/logo/cratebox-react-logo.jpg)

[Cratebox](https://github.com/alexvcasillas/cratebox) bindings for [React](https://github.com/facebook/react) in just **818B** of gzipped code (2.02KB bundle).

# Contents

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Create Context](#create-context)
* [Cratebox Consumer](#cratebox-consumer)

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

The **Cratebox Consumer** Component takes on single prop called `store`, and this will be the `identifier` of the store you would like to subscribe to within this particular component.

Within **Cratebox Consumer**'s direct children you'll have access to the full API of [Cratebox](https://github.com/alexvcasillas/cratebox) so you can dispatch changes to any store or even subscribe to other stores if you would like so. You'll have access to all of the subscribed model properties everytime it changes and you will be able to do Time Traveling and all of the awesome features that comes out of the box with [Cratebox](https://github.com/alexvcasillas/cratebox).
