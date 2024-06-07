import clsx from 'clsx';

const Button = (props: { label: string, class?: string }) => (
    <button class={clsx(
        "w-fit p-2 text-nowrap h-[36px] bg-[#1C263B] text-[#FFFFFF] font-inter font-bold text-[13px] leading-[16px] border-[2px] border-[#00B4D8] rounded-[6px] focus:outline-none hover:bg-[#172135]",
        props.class
    )}>
        {props.label}
    </button>
);

export default Button;
