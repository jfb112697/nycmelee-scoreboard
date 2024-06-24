import { createSignal, onMount, For } from "solid-js";
import { readBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import clsx from "clsx";

interface CharacterIconProps {
    imagePath: string;
    altText: string;
}

const CharacterIcon = (props: CharacterIconProps) => {
    const [base64Image, setBase64Image] = createSignal<string | undefined>(undefined);
    const [showPanel, setShowPanel] = createSignal(false);
    const [additionalImages, setAdditionalImages] = createSignal<string[]>([]);

    const loadImageAsBase64 = async (path: string) => {
        try {
            const fileData = await readBinaryFile(path, { dir: BaseDirectory.AppData });
            const base64String = `data:image/png;base64,${btoa(
                new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), "")
            )}`;
            return base64String;
        } catch (error) {
            console.error(`Failed to load image ${path}:`, error);
            return "";
        }
    };

    const loadAdditionalImages = async () => {
        // Implement logic to load additional images from the folder
        // This is a placeholder for the actual implementation
        const images = await Promise.all(
            ["image1.png", "image2.png", "image3.png"].map(image => loadImageAsBase64(image))
        );
        setAdditionalImages(images.filter(img => img !== null) as string[]);
    };

    onMount(async () => {
        const base64 = await loadImageAsBase64(props.imagePath);
        setBase64Image(base64);
    });

    return (
        <div class="relative">
            <div
                class="bg-nycmelee-grey-bg flex items-center justify-center rounded-[3px] overflow-clip w-fit px-2 cursor-pointer"
                onClick={() => {
                    setShowPanel(!showPanel());
                    if (!showPanel()) {
                        loadAdditionalImages();
                    }
                }}
            >
                {base64Image() ? (
                    <img src={base64Image()} alt={props.altText} class="h-12 w-12 object-cover rounded-[3px]" />
                ) : (
                    <span>Loading...</span>
                )}
            </div>
            {showPanel() && (
                <div class="absolute top-full mt-2 left-0 bg-white rounded-[3px] shadow-lg p-2 z-10 flex flex-wrap gap-2">
                    <For each={additionalImages()}>
                        {(image) => (
                            <img src={image} alt={props.altText} class="h-12 w-12 object-cover rounded-[3px] cursor-pointer" />
                        )}
                    </For>
                </div>
            )}
        </div>
    );
};

export default CharacterIcon;
