import TextBox from "./TextBox"; // Adjust the import path as needed
import Button from "./Button"; // Adjust the import path as needed

const RoundControls = () => {
  return (
    <div class="box-border flex items-stretch p-4 gap-4 flex-1 bg-nycmelee-dark-bg border-nycmelee-border border-[3px] border-[#00B4D8] rounded-[6px]">
      <div class="flex flex-1 flex-col flex-wrap items-center content-start gap-4 py-2">
        <div class="flex items-stretch w-full flex-1 gap-[10px]">
          <TextBox
            class="flex-1"
            value="Winners Quarters"
            placeholder="Round"
            flexGrow={true}
          />
          <Button label="Reset" />
          <Button label="Switch Ports" />
        </div>
        <Button label="Send Update" class="w-full flex-1" />
      </div>
    </div>
  );
};

export default RoundControls;
