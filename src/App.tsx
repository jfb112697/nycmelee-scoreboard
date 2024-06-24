// src/App.tsx
import Layout from "./components/Layout";
import { StateProvider } from "./context/StateContext";
import "./App.css";
import { DbProvider } from "./context/DatabaseContext";

function App(props: { children: any }) {
  return (
    <StateProvider>
      <DbProvider>
        <Layout>
          {props.children}
        </Layout>
      </DbProvider>
    </StateProvider>
  );
}

export default App;