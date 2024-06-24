import { For, createEffect, createSignal } from "solid-js";
import { useAppState } from "../context/StateContext";

const Commentary = () => {
    const { state, setState, commitScoreboard } = useAppState();

    const handleInputChange = (index: number, field: string, value: any) => {
        const commentators = state().scoreboard.Commentators || [];//@ts-ignore
        commentators[index][field] = value;
        setState({ ...state(), scoreboard: { ...state().scoreboard, commentators } });
        console.log(state().scoreboard.Commentators);
    };

    return (
        <div class="flex-1 p-6 flex-col gap-6 flex">
            <div class="w-full flex justify-between items-center">

            </div>

            <For each={state().scoreboard.Commentators}>{(commentator, index) =>
                <div class="bg-nycmelee-dark text-nycmelee-white p-4 rounded-md border-nycmelee-border border-4 flex items-stretch">
                    <div class="flex flex-col flex-1 gap-4">
                        <div class="flex flex-1 justify-between items-center">
                            <h1 class="text-lg font-bold">Name</h1>

                        </div>
                        <div class="flex flex-1 justify-between items-center">
                            <h1 class="text-lg font-bold">Twitter</h1>

                        </div>
                    </div>
                </div>
            }</For>

        </div>
    );
}

export default Commentary;
