import nycmelee from "../assets/nycmelee.png";

const TopBar = () => (
    <header class=" p-4 flex justify-between items-center">
          <div class="h-full flex flex-row items-center px-[11px] pl-[33px] gap-[19px] w-[666px] h-[100px] max-h-[100px]">
      <img
        src={nycmelee}
        alt="NYCMelee Logo"
        class="w-[76.03px] h-[78px] mix-blend-screen"
      />
      </div>
    </header>
  );
  
  export default TopBar;
  