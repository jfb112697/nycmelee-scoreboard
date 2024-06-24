import { createEffect, createSignal } from 'solid-js';
import { useDb } from "../context/DatabaseContext";
import { Combobox, ComboboxContent, ComboboxControl, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxItemLabel, ComboboxTrigger } from './ui/combobox';
import { useAppState } from '~/context/StateContext';

interface NameComboBoxProps {
}

const NameComboBox = (props: any) => {
    const name = props.name;
    const [value, setValue] = createSignal(name);
    const { updateState, state } = useAppState();
    const { getSuggestions, saveSuggestion } = useDb();
    const [options, setOptions] = createSignal(["Jeremy"]);



    const handleInputChange = () => {
        const handleChange = (index: number, field: string, value: any) => {
            let players = [...state().scoreboard.players]; // Clone the array to ensure reactivity
            players[index] = { ...players[index], [field]: value }; // Clone the object to ensure reactivity
            updateState({ players: players });
            console.log(state());
        }
        handleChange(props.index, "string", value());
    };

    createEffect(async () => {
        setOptions(await getSuggestions(value()));
        handleInputChange();
    });


    return (
        <Combobox<string>
            options={options()}
            optionValue={(item) => (item)}
            optionTextValue={(item) => (item)}
            optionLabel={(item) => (item)}
            placeholder="Name"
            defaultValue={props.name}
            value={props.name}
            class="w-full"
            itemComponent={(itemProps) => (
                <ComboboxItem item={itemProps.item}>
                    <ComboboxItemLabel>{itemProps.item.rawValue}</ComboboxItemLabel>
                    <ComboboxItemIndicator />
                </ComboboxItem>
            )}
        >
            <ComboboxControl aria-label="Names">
                <ComboboxInput
                />
                <ComboboxTrigger />
            </ComboboxControl>
            <ComboboxContent />
        </Combobox>
    );
};

export default NameComboBox;