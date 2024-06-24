import { createEffect, createSignal } from "solid-js";
import { useAppState } from "../context/StateContext";

const Settings = () => {
    const { state, setState } = useAppState();
    const [port, setPort] = createSignal(state().secrets.port || "80");
    const [apiKey, setApiKey] = createSignal("");

    createEffect(() => {
        setState({ ...state(), secrets: { api_key: apiKey(), port: port() } })
    }
    );

    return (
        <div class="flex-1 p-6 flex-col">
            <div class="bg-nycmelee-dark text-nycmelee-white p-4 rounded-md border-nycmelee-border border-4 flex items-stretch">
                <div class="flex flex-col flex-1 gap-4">
                    <div class="flex flex-1 justify-between items-center">
                        <h1 class="text-lg font-bold">StartGG API Key</h1>
                    </div>
                    <div class="flex flex-1 justify-between items-center">
                        <h1 class="text-lg font-bold">Port</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
