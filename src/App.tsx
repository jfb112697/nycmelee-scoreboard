// src/App.tsx
import { Router, Route } from "@solidjs/router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { StateProvider } from "./context/StateContext";
import "./App.css";

function App() {
  return (
    <StateProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
        </Router>
      </Layout>
    </StateProvider>
  );
}

export default App;