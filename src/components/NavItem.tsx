import { A } from "@solidjs/router";

const NavItem = (props: { title: string, isActive?: boolean }) => (
    <div
        class={`w-[174px] h-[44px] flex flex-col items-start p-[10px_25px] gap-2.5 border-l-[3px] ${props.isActive
            ? 'border-[#00B4D8] text-[#00B4D8]'
            : 'border-transparent text-[#E8E8E8]'
            }`}
    >
        <div class="font-inter font-bold text-[20px] leading-[24px]">
            {props.title}
        </div>
    </div>
);

export default NavItem;