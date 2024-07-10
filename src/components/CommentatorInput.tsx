import { createSignal, createEffect } from "solid-js";
import { TextField } from "./ui/text-field";
import { CardContent } from "./ui/card";
import { TextFieldLabel, TextFieldInput } from "./ui/text-field";
import { Button } from "./ui/button";

// Inside your component, before the return statement:
const CommentatorInput = (props: {
  commentator: { name: any; twitter: any };
  setState: (arg0: { (prev: any): any; (prev: any): any }) => void;
  index: number;
}) => {
  const [localName, setLocalName] = createSignal(props.commentator.name || "");
  const [localTwitter, setLocalTwitter] = createSignal(
    props.commentator.twitter || ""
  );

  createEffect(() => {
    setLocalName(props.commentator.name || "");
    setLocalTwitter(props.commentator.twitter || "");
  });

  const updateGlobalState = () => {
    props.setState((prev: { scoreboard: { Commentators: any } }) => {
      const newCommentators = [...prev.scoreboard.Commentators];
      newCommentators[props.index] = {
        ...newCommentators[props.index],
        name: localName(),
        twitter: localTwitter(),
      };
      return {
        ...prev,
        scoreboard: {
          ...prev.scoreboard,
          Commentators: newCommentators,
        },
      };
    });
  };

  return (
    <CardContent>
      <div class="flex flex-row gap-3 items-end">
        <TextField>
          <TextFieldLabel>Name</TextFieldLabel>
          <TextFieldInput
            type="text"
            id="name"
            placeholder="Name"
            value={localName()}
            onInput={(e: { currentTarget: { value: any } }) =>
              setLocalName(e.currentTarget.value)
            }
            onBlur={updateGlobalState}
          />
        </TextField>
        <TextField>
          <TextFieldLabel>Twitter</TextFieldLabel>
          <TextFieldInput
            type="text"
            id="twitter"
            placeholder="Twitter"
            value={localTwitter()}
            onInput={(e: { currentTarget: { value: any } }) =>
              setLocalTwitter(e.currentTarget.value)
            }
            onBlur={updateGlobalState}
          />
        </TextField>
        <Button
          variant={"destructive"}
          class="ms-auto"
          onClick={() => {
            props.setState((prev: { scoreboard: { Commentators: any } }) => {
              const newCommentators = [...prev.scoreboard.Commentators];
              newCommentators.splice(props.index, 1);
              return {
                ...prev,
                scoreboard: {
                  ...prev.scoreboard,
                  Commentators: newCommentators,
                },
              };
            });
          }}
        >
          Remove
        </Button>
      </div>
    </CardContent>
  );
};

export default CommentatorInput;
