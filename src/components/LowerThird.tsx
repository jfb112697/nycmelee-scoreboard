import { Component, createEffect, createSignal } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TextField, TextFieldInput, TextFieldLabel } from "./ui/text-field";
import { useAppState } from "~/context/StateContext";

const LowerThird = () => {
  const [tabValue, setTabValue] = createSignal("now");
  const { state, setState } = useAppState();
  const [lowerThirdText, setLowerThirdText] = createSignal(
    state.scoreboard.lowerThird.Text1
  );

  createEffect(() => {
    const value = tabValue();
    console.log(value);
    let [player1, player2] = state.scoreboard.players;
    if (value === "now") {
      setLowerThirdText(`NOW: ${player1.name} vs ${player2.name}`);
    } else if (value == "next") {
      console.log(state);
      if (state.selectedStream && state.streamQueues) {
        const streamQueue = state.streamQueues.find(
          (sQ) => sQ.stream.streamName === state.selectedStream
        );
        console.log(streamQueue);
        if (streamQueue) {
          let [entrant1, entrant2] = streamQueue.sets[0].slots;
          console.log(entrant1, entrant2);
          setLowerThirdText(
            `NEXT: ${entrant1.entrant.name} vs ${entrant2.entrant.name}`
          );
        }
      }
    }
  });
  return (
    <Card class="flex flex-col justify-between w-full">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Lower Third</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4"></CardContent>
      <Tabs
        defaultValue="now"
        onChange={(v) => setTabValue(v)}
        value={tabValue()}
        class="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="now">Now</TabsTrigger>
          <TabsTrigger value="next">Next</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
      </Tabs>
      <TextField>
        <TextFieldLabel>Lower Third Text</TextFieldLabel>
        <TextFieldInput
          type="text"
          disabled={tabValue() !== "custom"}
          id="name"
          placeholder="Name"
          value={lowerThirdText()}
          onInput={setLowerThirdText}
        />
      </TextField>
    </Card>
  );
};

export default LowerThird;
