/** @jsx jsx */
import { jsx } from "snabbdom-jsx-lite";
import FSXDialog from "../FSXDialog";
import { css } from "emotion";

export const enum RollType {
  fortune = "fortune",
  action = "action",
}

const RollDialog = ({
  dice,
  type,
  action,
  closeDialog,
}: {
  dice: number;
  type: RollType;
  action?: string;
  closeDialog: () => void;
}) => (
  <div class={{ [css({ color: "red" })]: true }}>
    <p>
      Roll {action.capitalize()}: {dice} dice
    </p>
    <p>Bonuses: x dice, x effect</p>
    <p>Penalties: x dice, x effect</p>
    <p>FINAL_DICE FINAL_EFFECT FINAL_POSITION</p>
    <button
      on={{
        click: async () => {
          // @ts-expect-error
          const roll = FitDRoll(dice, { action });
          await roll.toMessage({ flavor: `<h1>${action.capitalize()}</h1>` });
          closeDialog();
        },
      }}
    >
      Roll
    </button>
  </div>
);

const createRollDialog = (
  args: Omit<Parameters<typeof RollDialog>[0], "closeDialog">
) =>
  new FSXDialog(
    {
      title: "Roll",
      yes: () => console.log("yes"),
      no: () => console.log("no"),
      content: (dialog, data, options) => {
        console.log("???", dialog, data, options);
        return <RollDialog {...args} closeDialog={dialog.close.bind(dialog)} />;
      },
      buttons: [],
    },
    {
      // TODO: figure out why this isn't working
      classes: ["fitd", "scum-and-villainy", "roll"],
    }
  );

export default createRollDialog;
