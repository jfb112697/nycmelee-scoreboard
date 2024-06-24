/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Commentary from "./pages/Commentary";
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from "@kobalte/core"

const storageManager = createLocalStorageManager("vite-ui-theme");

render(() => (
  <>
    <ColorModeScript storageType={storageManager.type} />
    <ColorModeProvider storageManager={storageManager}>{/*@ts-ignore*/}
      <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="/commentary" component={Commentary} />
        <Route path="/settings" component={Settings} />
        <Route path="*paramName" component={Home} />
      </Router>
    </ColorModeProvider>
  </>
), document.getElementById("root") as HTMLElement);
