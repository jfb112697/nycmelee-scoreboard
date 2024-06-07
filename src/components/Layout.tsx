import { JSX } from "solid-js";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

const Layout = (props: { children: JSX.Element }) => (
    <div class=" bg-nycmelee-bg flex flex-col h-screen">
        <TopBar />
        <div class="flex flex-1">
            <Navbar />
            <main class="flex-1 flex p-4">
                {props.children}
            </main>
        </div>
    </div>
);

export default Layout;
