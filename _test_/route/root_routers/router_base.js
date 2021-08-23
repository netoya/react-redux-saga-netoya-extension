import React from "react";
import { Route, Switch } from "react-router";

function RootRoute() {
  return (
    <Switch>
      <Route render={() => <div>Pagina no encontrada</div>} />
    </Switch>
  );
}

export default RootRoute;
