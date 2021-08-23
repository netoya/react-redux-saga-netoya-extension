import React from "react";
import { Route, Switch } from "react-router";
import { HomeRoute } from "../modules/home/handlers/homeRoutes";

function RootRoute() {
  return (
    <Switch>
      <HomeRoute path={"/home"}></HomeRoute>
      <Route render={() => <div>Pagina no encontrada</div>} />
    </Switch>
  );
}

export default RootRoute;
