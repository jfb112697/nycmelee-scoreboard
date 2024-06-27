import nycmelee from "../assets/nycmelee.png";
import CommandSearchBar from "./CommandSearchBar";
import { MainNav } from "./Nav/MainNav";
import SettingsPage from "./Settings/SettingsPage";
import { Button } from "./ui/button";

const TopBar = () => (
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <div class="flex items-center gap-4">
          <CommandSearchBar />
          <SettingsPage />
        </div>
      </div>
    </div>
  </div>
);

export default TopBar;
