// src/App.tsx
import Layout from "./components/Layout";
import { StateProvider } from "./context/StateContext";
import "./App.css";
import { DbProvider } from "./context/DatabaseContext";
import { fetch } from "@tauri-apps/api/http";

function App(props: { children: any }) {
  return (
    <DbProvider>
      <StateProvider>
        <Layout>{props.children}</Layout>
      </StateProvider>
    </DbProvider>
  );
}

export default App;
