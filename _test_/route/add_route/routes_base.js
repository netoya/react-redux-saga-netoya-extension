import React from "react";
import { Route, Switch } from "react-router";

export const ModuleRoute = ({ path }) => (
  <Route
    path={path}
    render={({ match: { url } }) => (
      <Switch>
        <Route component={() => <div>Not found module</div>} />
        <Route path={`/`} componet={componentPage}></Route>
      </Switch>
    )}
  />
);
