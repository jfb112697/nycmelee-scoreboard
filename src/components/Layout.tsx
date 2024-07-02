import { JSX } from "solid-js";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

const Layout = (props: { children: JSX.Element }) => (
  <div
    class="flex flex-col overflow-y-auto h-screen hide-scrollbar"
    style={{ "scrollbar-width": "none", "-ms-overflow-style": "none" }}
  >
    <TopBar />
    <div class="flex flex-1">
      <main class="flex-1 flex-col flex justify-center">{props.children}</main>
    </div>
  </div>
);

export default Layout;
