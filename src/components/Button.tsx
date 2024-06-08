import clsx from "clsx";

const Button = (props: { label: string; class?: string }) => (
  <button
    class={clsx(
      "w-fit px-4 text-nowrap bg-[#1C263B] text-[#FFFFFF] font-inter font-bold text-[13px] leading-[16px] border-[2px] border-[#00B4D8] rounded-[6px] focus:outline-none hover:bg-[#172135] min-h-[47px]",
      props.class,
    )}
  >
    {props.label}
  </button>
);

export default Button;
