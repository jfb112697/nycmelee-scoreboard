/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Route, Router } from "@solidjs/router";

render(() => (
    <Router root={App}>
      <Route path="/" component={App} />
    </Router>
  ), document.getElementById("root") as HTMLElement);
