import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

// components

import Login from "./components/login";
import Register from "./components/register";
import ListTransactions from "./components/home2";
import NewTransaction from "./components/newtransaction2";

// router

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" render={(props) => <Login {...props} />} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home2" component={ListTransactions} />
        <Route path="/newtransaction" component={NewTransaction} />
        <Route component={Error} />
      </Switch>
    </main>
  );
}

export default withRouter(App);
