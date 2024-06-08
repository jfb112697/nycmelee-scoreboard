import { createSignal, createEffect, onMount } from "solid-js";
import clsx from "clsx";

const TextBox = (props: {
  value: string;
  placeholder?: string;
  class?: string;
  flexGrow?: boolean;
}) => {
  let inputRef: HTMLInputElement | undefined;

  // Create a signal for the input value
  const [inputValue, setInputValue] = createSignal(props.value);
  const [minWidth, setMinWidth] = createSignal(60);

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

      console.log(inputValue, props.placeholder, tempSpan.offsetWidth + 4);
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
      const placeholderWidth = tempSpan.offsetWidth + 2;
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
    <div
      class={clsx(
        "flex items-center bg-[#4D4D4D] text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none",
        props.flexGrow ? "flex-grow" : "",
        props.class,
      )}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue()}
        placeholder={props.placeholder}
        class={clsx(
          "bg-transparent text-[#E8E8E8] font-inter font-bold text-[13px] p-2 rounded-[3px] focus:outline-none h-fit w-full",
          props.flexGrow ? "flex-grow w-full" : "",
        )}
        style={{ "min-width": `${minWidth()}px` }}
        onInput={(e) => {
          setInputValue(e.currentTarget.value);
          adjustWidth();
        }}
      />
    </div>
  );
};

export default TextBox;
