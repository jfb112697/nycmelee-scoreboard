import { createMemo, createEffect, batch } from "solid-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TextField, TextFieldInput, TextFieldLabel } from "./ui/text-field";
import { useAppState } from "~/context/StateContext";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/switch";
import { Button } from "./ui/button";

const LowerThird = () => {
  const { state, update, commitScoreboard } = useAppState();

  const lowerThirdData = createMemo(() => {
    const { lowerThird, players } = state.scoreboard;
    const mode = lowerThird.mode;
    let annotation = lowerThird.LeftAnnotationText;
    let text = lowerThird.TitleText;

    if (mode === "now") {
      annotation = "NOW";
      text = `${players[0].name} vs ${players[1].name}`;
    } else if (mode === "next") {
      if (state.selectedStream && state.streamQueues) {
        const streamQueue = state.streamQueues.find(
          (sQ: any) => sQ.stream.streamName === state.selectedStream
        );
        if (streamQueue && streamQueue.sets.length > 0) {
          let [entrant1, entrant2] = streamQueue.sets[0].slots;
          annotation = "NEXT";
          text = `${entrant1.entrant.name} vs ${entrant2.entrant.name}`;
        }
      }
    }

    return { mode, annotation, text };
  });

  createEffect(() => {
    const { mode, annotation, text } = lowerThirdData();
    batch(() => {
      update.scoreboard.lowerThird.update({
        mode,
        LeftAnnotationText: annotation,
        TitleText: text,
      });
    });
  });

  const handleTabChange = (value: any) => {
    update.scoreboard.lowerThird.update({ mode: value });
  };

  const handleAnnotationChange = (e: { currentTarget: { value: any } }) => {
    update.scoreboard.lowerThird.update({
      LeftAnnotationText: e.currentTarget.value,
    });
  };

  const handleTitleChange = (e: { currentTarget: { value: any } }) => {
    update.scoreboard.lowerThird.update({ TitleText: e.currentTarget.value });
  };

  const handleCommentaryToggle = (e: any) => {
    update.scoreboard.lowerThird.update({ Commentary: e });
  };

  const handleScoresToggle = (e: any) => {
    update.scoreboard.lowerThird.update({ Scores: e });
  };

  const handleUpdateLowerThird = () => {
    commitScoreboard();
  };

  return (
    <Card class="flex flex-col justify-between w-full">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Lower Third</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex w-full items-center justify-between">
          <Tabs
            defaultValue={lowerThirdData().mode}
            onChange={handleTabChange}
            value={lowerThirdData().mode}
            class="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="now">Now</TabsTrigger>
              <TabsTrigger
                value="next"
                disabled={!(state.selectedStream && state.streamQueues)}
              >
                Next
              </TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>
          <Switch
            class="flex items-center space-x-2"
            checked={state.scoreboard.lowerThird.Commentary}
            onChange={handleCommentaryToggle}
          >
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchLabel>Show Commentary</SwitchLabel>
          </Switch>
          <Switch
            class="flex items-center space-x-2"
            checked={state.scoreboard.lowerThird.Scores}
            onChange={handleScoresToggle}
          >
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchLabel>Show Scores</SwitchLabel>
          </Switch>
        </div>
        <div class="flex items-center justify-center gap-4">
          <TextField>
            <TextFieldLabel class="text-nowrap">
              Lower Third Annotation
            </TextFieldLabel>
            <TextFieldInput
              class="max-w-[100px]"
              type="text"
              disabled={lowerThirdData().mode !== "custom"}
              id="annotation"
              placeholder="Annotation"
              value={lowerThirdData().annotation}
              onInput={handleAnnotationChange}
            />
          </TextField>
          <TextField class="w-full">
            <TextFieldLabel>Lower Third Title</TextFieldLabel>
            <TextFieldInput
              type="text"
              disabled={lowerThirdData().mode !== "custom"}
              id="title"
              placeholder="Title"
              value={lowerThirdData().text}
              onInput={handleTitleChange}
            />
          </TextField>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateLowerThird}>Update Lower Third</Button>
      </CardFooter>
    </Card>
  );
};

export default LowerThird;
