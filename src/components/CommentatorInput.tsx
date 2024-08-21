import { createMemo } from "solid-js";
import { TextField, TextFieldInput } from "./ui/text-field";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAppState } from "~/context/StateContext";
import { produce } from "solid-js/store";

const CommentatorInput = (props: { index: number }) => {
  const { state, setState } = useAppState();

  const commentator = createMemo(
    () => state.scoreboard.Commentators[props.index]
  );

  const updateCommentator = (
    data: Partial<{ name: string; twitter: string }>
  ) => {
    setState(
      produce((s) => {
        Object.assign(s.scoreboard.Commentators[props.index], data);
      })
    );
  };

  return (
    <CardContent>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between gap-3 items-end w-full">
          <TextField class="w-full">
            <TextFieldInput
              type="text"
              id={`commentator-name-${props.index}`}
              placeholder="Name"
              value={commentator().name || ""}
              onInput={(e) =>
                updateCommentator({ name: e.currentTarget.value })
              }
            />
          </TextField>
          <TextField class="w-full">
            <TextFieldInput
              type="text"
              id={`commentator-twitter-${props.index}`}
              placeholder="Twitter"
              value={commentator().twitter || ""}
              onInput={(e) =>
                updateCommentator({ twitter: e.currentTarget.value })
              }
            />
          </TextField>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            updateCommentator({ name: "", twitter: "" });
          }}
        >
          Reset
        </Button>
      </div>
    </CardContent>
  );
};

export default CommentatorInput;
