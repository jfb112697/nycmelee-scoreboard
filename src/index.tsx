/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import StreamQueue from "./pages/StreamQueue";

const storageManager = createLocalStorageManager("vite-ui-theme");

render(
  () => (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        {/*@ts-ignore*/}
        <Router root={App}>
          <Route path="/" component={Home} />
          <Route path="/stream-queue" component={StreamQueue} />
        </Router>
      </ColorModeProvider>
    </>
  ),
  document.getElementById("root") as HTMLElement
);
