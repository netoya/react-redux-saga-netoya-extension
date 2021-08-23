import React from "react";
import { Route, Switch } from "react-router";
import { ArdillaRouters } from "../modules/ardilla/handlers/ardillaRouters";
import { CoalaRouters } from "../modules/coala/handlers/coalaRouters";
import { PerroRouters } from "../modules/perro/handlers/perroRouters";

function RootRoute() {
  return (
    <Switch>
      <PerroRouters path={`/animal/perro`}></PerroRouters>
      <CoalaRouters path={`/coala/animal`}></CoalaRouters>
      <Route render={() => <div>Pagina no encontrada</div>} />
      <ArdillaRouters path={`/`}></ArdillaRouters>
    </Switch>
  );
}

export default RootRoute;
