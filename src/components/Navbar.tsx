import { A, useLocation } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = createSignal(location.pathname);

  createEffect(() => {
    setActivePath(location.pathname);
  });

  const isActive = (path: string) => activePath() === path;

  return (
    <nav class="box-border flex flex-col items-start p-0 gap-2.5 border-r-[3px] border-[rgba(0,180,216,0.47)]">
      <A href="/"><NavItem title="Match" isActive={isActive("/")} /></A>
      <A href="/lower-third"><NavItem title="Lower Third" isActive={isActive("/lower-third")} /></A>
      <A href="/commentary"><NavItem title="Commentary" isActive={isActive("/commentary")} /></A>
      <A href="/urls"><NavItem title="URLs" isActive={isActive("/urls")} /></A>
      <A href="/settings"><NavItem title="Settings" isActive={isActive("/settings")} /></A>
    </nav>
  );
}

export default Navbar;
