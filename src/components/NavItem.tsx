import { A } from "@solidjs/router";

const NavItem = (props: { title: string, path: string, isActive?: boolean }) => (
    <A
        href={props.path}
        class={`w-[174px] h-[44px] flex flex-col items-start p-[10px_25px] gap-2.5 ${props.isActive
                ? 'border-l-[3px] border-[#00B4D8] text-[#00B4D8]'
                : 'text-[#E8E8E8]'
            }`}
    >
        <div class="font-inter font-bold text-[20px] leading-[24px]">
            {props.title}
        </div>
    </A>
);

export default NavItem;
