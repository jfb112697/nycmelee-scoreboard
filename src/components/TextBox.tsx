import clsx from 'clsx';

const TextBox = (props: { value: string, placeholder?: string, class?: string }) => (
    <div
        class={clsx(
            "flex items-center bg-[#4D4D4D] text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none min-w-[75px]",
            props.class
        )}
    >
        <input
            type="text"
            value={props.value}
            placeholder={props.placeholder}
            class="w-fit text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none min-w-[60px]"
        />
    </div>
);

export default TextBox;
