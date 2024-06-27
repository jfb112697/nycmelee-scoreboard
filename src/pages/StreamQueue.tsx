import { createSignal } from "solid-js";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppState } from "~/context/StateContext";

const StreamQueue = () => {
  const { state } = useAppState();
  const [showMessage, setShowMessage] = createSignal(false);

  if (!state.secrets.ggToken) {
    setShowMessage(true);
  }

  return (
    <div class="flex flex-col w-full h-full items-start justify-start p-4">
      <h1 class="text-[30px] font-extrabold">Stream Queue</h1>
      {!state.settings.ggApiToken ? (
        <Card class="w-full mt-4">
          <CardHeader>
            <CardTitle>GG API Token Required</CardTitle>
          </CardHeader>
          <div class="p-4">
            <p>
              To use the stream queue, you need to provide a GG API token. You
              can get one by visiting{" "}
              <a
                href="https://smash.gg/developer"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                smash.gg/developer
              </a>
              .
            </p>
          </div>
        </Card>
      ) : (
        <Card class="w-full mt-4">
          <CardHeader>
            <CardTitle>Stream Queue</CardTitle>
          </CardHeader>
          <div class="p-4">
            <p>Stream queue goes here.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StreamQueue;
