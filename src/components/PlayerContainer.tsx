import TextBox from "./TextBox";
import Button from "./Button";
import { createSignal } from 'solid-js';
import { Player } from '../types';
import { useAppState } from '../context/StateContext';

interface PlayerContainerProps {
    playerKey: 'Player1' | 'Player2';
}

const PlayerContainer = ({ playerKey }: PlayerContainerProps) => {
    const { state, setState } = useAppState();
    const player = state[playerKey];
    const [localPlayer, setLocalPlayer] = createSignal(player);

    return (
        <div class="flex-1 box-border flex justify-center w-full items-center gap-2.5 bg-[#0D1B2A] border-[3px] border-[#00B4D8] rounded-[6px]">
            <div class="flex flex-1 flex-col gap-2 w-full px-4">
                {/* Frame 36 */}
                <div class="flex flex-row items-start gap-2.5">
                    {/* TextBox 1 */}
                    <TextBox
                        value={localPlayer().sponsor || ""}
                        placeholder="Sponsor"
                    />
                    {/* TextBox 2 */}
                    <TextBox
                        value={localPlayer().name}
                        placeholder="Name"
                        class="flex-grow"
                    />
                    {/* TextBox 3 */}
                    <TextBox
                        value={localPlayer().character}
                        placeholder="Character"
                    />
                </div>

                {/* Frame 37 */}
                <div class="flex flex-row items-center gap-2.5 w-full">
                    {/* TextBox 4 */}
                    <TextBox
                        value={localPlayer().score.toString()}
                        placeholder="Score"
                        class="flex-grow"
                    />
                    {/* Button */}
                    <Button
                        label="Select Winner"
                        class="w-[120px]" // Adjust width as needed
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerContainer;
