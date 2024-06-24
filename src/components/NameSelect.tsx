// NameSelect.tsx
import { createSignal, createEffect, onCleanup } from 'solid-js';//@ts-ignore
import { Select, createOptions, createAsyncOptions } from '@thisbeyond/solid-select';
import { useDb } from '../context/DatabaseContext';

interface NameSelectProps {
    value: string;
    placeholder: string;
    onInput: (e: any) => void;
}

function NameSelect(props: NameSelectProps) {
    const { getSuggestions, saveSuggestion } = useDb();
    const [inputValue, setInputValue] = createSignal<string>(props.value || '');

    const fetchSuggestions = async (inputValue: string) => {
        return new Promise(async (resolve) => {
            const suggestions = await getSuggestions(inputValue) || await getSuggestions("");
            console.log(suggestions);
            resolve(suggestions);
        });
    };

    const selectProps = createAsyncOptions(fetchSuggestions, {
        createable: true,
    });

    const handleBlur = async () => {
        const currentValue = inputValue();
        const suggestions = await getSuggestions(currentValue);
        if (!suggestions.includes(currentValue)) {
            await saveSuggestion(currentValue);
        }
    };

    const handleKeyPress = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const currentValue = inputValue();
            const suggestions = await getSuggestions(currentValue);
            if (!suggestions.includes(currentValue)) {
                await saveSuggestion(currentValue);
            }
        }
    };

    return (
        <div class="flex flex-1 items-stretch">
            <Select
                {...selectProps}
                initialValue={props.value}
                onBlur={handleBlur}
                onChange={(e: string) => { props.onInput(e); setInputValue(e); }}
            />
        </div>
    );
};

export default NameSelect;
