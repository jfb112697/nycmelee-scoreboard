import { A, useLocation } from "@solidjs/router";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav class="box-border flex flex-col items-start p-0 gap-2.5  border-r-[3px] border-[rgba(0,180,216,0.47)]">
      <NavItem title="Match" path="/" isActive={isActive("/")} />
      <NavItem title="Lower Third" path="/lower-third" isActive={isActive("/lower-third")} />
      <NavItem title="Commentary" path="/commentary" isActive={isActive("/commentary")} />
      <NavItem title="URLs" path="/urls" isActive={isActive("/urls")} />
      <NavItem title="Settings" path="/settings" isActive={isActive("/settings")} />
    </nav>
  );
}

export default Navbar;
