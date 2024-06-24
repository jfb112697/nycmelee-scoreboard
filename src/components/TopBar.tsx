
import nycmelee from "../assets/nycmelee.png";
import { MainNav } from "./Nav/MainNav";
import { Button } from "./ui/button";



const TopBar = () => (
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <div>
          <Button>Settings</Button>
        </div>
      </div>
    </div>
  </div>
);

export default TopBar;
