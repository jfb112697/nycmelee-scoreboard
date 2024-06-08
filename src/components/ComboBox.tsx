import { createSignal, createEffect, onMount, For } from "solid-js";
import clsx from "clsx";

const ComboBox = (props: {
  options: { label: string; image?: string }[];
  value: string;
  placeholder?: string;
  class?: string;
  flexGrow?: boolean;
}) => {
  let inputRef: HTMLInputElement | undefined;

  // Create a signal for the input value
  const [inputValue, setInputValue] = createSignal(props.value);
  const [minWidth, setMinWidth] = createSignal(60);
  const [showDropdown, setShowDropdown] = createSignal(false);

  // Function to adjust the input width based on its content
  const adjustWidth = () => {
    if (inputRef && !props.flexGrow) {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "pre";
      tempSpan.style.font = "bold 13px Inter";
      tempSpan.textContent = inputValue() || props.placeholder || " ";
      document.body.appendChild(tempSpan);

      const newWidth = Math.max(minWidth(), tempSpan.offsetWidth + 24);
      inputRef.style.width = `${newWidth}px`;
      document.body.removeChild(tempSpan);
    }
  };

  // Calculate the min width based on the placeholder
  const calculateMinWidth = () => {
    if (props.placeholder) {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "pre";
      tempSpan.style.font = "bold 13px Inter";
      tempSpan.textContent = props.placeholder;
      document.body.appendChild(tempSpan);
      const placeholderWidth = tempSpan.offsetWidth - 24;
      setMinWidth(placeholderWidth);
      document.body.removeChild(tempSpan);
    }
  };

  // Adjust width when the component mounts and when the input value changes
  createEffect(() => {
    adjustWidth();
  });

  // Calculate min width based on the placeholder when the component mounts
  onMount(() => {
    calculateMinWidth();
    adjustWidth();
  });

  return (
    <div class="relative">
      <div
        class={clsx(
          "flex items-center bg-[#4D4D4D] text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none h-fit cursor-pointer",
          props.flexGrow ? "flex-grow" : "",
          props.class,
        )}
        onClick={() => setShowDropdown(!showDropdown())}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue()}
          placeholder={props.placeholder}
          class={clsx(
            "bg-transparent text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none h-fit cursor-pointer flex-grow w-full",
          )}
          style={{ "min-width": `${minWidth()}px` }}
          onInput={(e) => {
            setInputValue(e.currentTarget.value);
            adjustWidth();
          }}
        />
        <div class="ml-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 10l5 5 5-5H7z" fill="#E8E8E8" />
          </svg>
        </div>
      </div>
      {showDropdown() && (
        <div class="absolute top-full mt-1 left-0 right-0 bg-[#4C4C4C] rounded-[4px] shadow-lg z-10 overflow-hidden flex flex-col gap-2">
          <For each={props.options}>
            {(option) => (
              <div
                class="flex px-4 py-2 text-[#E8E8E8] hover:bg-[#3C3C3C] cursor-pointer"
                onClick={() => {
                  setInputValue(option.label);
                  setShowDropdown(false);
                }}
              >
                {option.image && (
                  <div class="w-8 h-8 mr-2 overflow-clip">
                    <img
                      src={option.image}
                      alt={option.label}
                      class="h-12 w-12 object-cover rounded-[3px]"
                    />
                  </div>
                )}
                <span>{option.label}</span>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default ComboBox;
