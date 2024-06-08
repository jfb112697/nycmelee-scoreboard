import TextBox from "./TextBox";
import Button from "./Button";
import { createSignal } from "solid-js";
import { useAppState } from "../context/StateContext";
import fox from "../assets/Characters/Fox/0.png";
import falco from "../assets/Characters/Falco/0.png";
import sheik from "../assets/Characters/Sheik/0.png";
import ComboBox from "./ComboBox";

interface PlayerContainerProps {
  playerKey: "Player1" | "Player2";
}

const PlayerContainer = ({ playerKey }: PlayerContainerProps) => {
  const { state, setState } = useAppState();
  const player = state[playerKey];
  const [localPlayer, setLocalPlayer] = createSignal(player);

  const options = [
    { label: "Fox", image: fox },
    { label: "Falco", image: falco },
    { label: "Sheik", image: sheik },
  ];

  return (
    <div class="flex-1 box-border flex justify-center w-full items-center gap-2.5 bg-[#0D1B2A] border-[3px] border-[#00B4D8] rounded-[6px] py-4">
      <div class="flex flex-1 flex-col gap-2 w-full px-4">
        {/* Frame 36 */}
        <div class="flex flex-row gap-2.5 items-stretch">
          {/* TextBox 1 */}
          <TextBox value={localPlayer().sponsor || ""} placeholder="Sponsor" />
          {/* TextBox 2 */}
          <TextBox value={localPlayer().name} placeholder="Name" flexGrow />
          {/* TextBox 3 */}
          <ComboBox
            options={options}
            value="Fox"
            placeholder="Select an option"
            class="your-custom-class"
          />
        </div>

        {/* Frame 37 */}
        <div class="flex flex-row items-sretch gap-2.5 w-full">
          {/* TextBox 4 */}
          <TextBox value={localPlayer().score.toString()} placeholder="Score" />
          <ComboBox
            options={[
              { label: "He/Him" },
              { label: "She/Her" },
              { label: "He/They" },
              { label: "She/They" },
              { label: "They/Them" },
            ]}
            value="He/Him"
            placeholder="Pronouns"
          />
          {/* Button */}
          <Button
            label="Select Winner"
            class="w-[120px] flex-1" // Adjust width as needed
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContainer;
