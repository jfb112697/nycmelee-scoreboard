import TextBox from './TextBox'; // Adjust the import path as needed
import Button from './Button'; // Adjust the import path as needed

const RoundControls = () => {
    return (
        <div class="box-border flex items-center p-[15px_25px] gap-4 flex-1 bg-nycmelee-dark-bg border-nycmelee-border border-[3px] border-[#00B4D8] rounded-[6px]">
            <div class="flex flex-1 flex-col flex-wrap items-center content-start gap-4">
                <div class="flex w-full flex-1 gap-[10px]">
                    <TextBox class="flex-1" value="Winners Quarters" placeholder="Round" />
                    <Button label="Reset" />
                    <Button label="Switch Ports" />
                </div>
                <Button label="Send Update" class="w-full flex-1" />
            </div>
        </div>
    );
};

export default RoundControls;
