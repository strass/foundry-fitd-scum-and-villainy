/** @jsx jsx */
import { jsx } from "snabbdom-jsx-lite";
import type { VNode } from "snabbdom/vnode";
import toVNode from "snabbdom/tovnode";
import patch from "../fitd-scum-and-villainy";
import type FITD_TEMPLATE from "../../../fitd/src/template.json";
import Grid from "./Grid";
import {
  Stress,
  Trauma,
  Traumas,
  Action,
  SelectPlaybook,
  Item,
  SaVRange,
  RollButton,
  Input,
} from "./components";
import { updateArray, toggleRange, arrayWithout, arrayWith } from "./util";
import FSXDialog from "./FSXDialog";
import moves from "./moves";
import { css, injectGlobal } from "emotion";
import {
  smallCaps,
  bold,
  flexRow,
  unstyleList,
  horizontalList,
} from "../style";
import set from "lodash.set";

interface FitDItemData
  extends Omit<typeof FITD_TEMPLATE["Item"], "types" | "templates"> {}

type FitDItems = {
  [K in keyof FitDItemData]: Item & { data: FitDItemData[K] };
};

type Resource<D extends object = {}> = {
  min: number;
  max: number;
  value: number;
} & D;

type ASD = ActorSheetData["data"];
type PC = typeof FITD_TEMPLATE["Actor"]["pc"];
interface FitDActorSheetDataData extends ASD, PC {
  traumas: string[];
  details: {
    alias: string;
    heritage: string;
    background: string;
    vice: string;
  };
  xp: Partial<
    Record<
      "insight" | "prowess" | "resist",
      { value: number; max: number; min: number }
    >
  >;
  actions: Resource<{
    name: string;
    attribute: "prowess" | "insight" | "resolve";
  }>[];
  armor: Resource<{
    name: string;
  }>[];
  harm: Resource<{ level: number; descriptions: string[]; penalty: string }>[];
}

type FitDActorSheet = ActorSheetData & {
  data: FitDActorSheetDataData;
};

injectGlobal({
  ".fitd.sheet.actor.pc.scum-and-villainy": {
    h1: {
      borderBottom: "none",
    },
  },
});

export class FitDScumAndVillainyActorSheet extends ActorSheet {
  _vnode: VNode;
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fitd", "sheet", "actor", "pc", "scum-and-villainy"],
      width: 1100,
      height: 750,
    });
  }

  _handleUpdateActorEvent = (path: string) => (
    event: FocusEvent | InputEvent
  ) =>
    this.actor.update(set({}, path, (event.target as HTMLInputElement).value));

  _handleUpdateActorValue = (path: string) => (value: string) =>
    this.actor.update(set({}, path, value));

  // This is where you write your app in JSX.
  _renderFSXTemplate({ actor, data }: FitDActorSheet, options): VNode {
    console.log(actor, options);

    const moves: FitDItems["move"][] = actor.items.filter(
      ({ type }) => type === "move"
    ) as any;
    const items: FitDItems["item"][] = actor.items.filter(
      ({ type }) => type === "item"
    ) as any;
    const systemItems = items.filter(
      ({ data: { source } }) => source === "default-system"
    );
    console.log(items);
    const allActions = data?.actions ?? [];
    const insightActions = allActions.filter(
      ({ attribute }) => attribute === "insight"
    );
    const prowessActions = allActions.filter(
      ({ attribute }) => attribute === "prowess"
    );
    const resolveActions = allActions.filter(
      ({ attribute }) => attribute === "resolve"
    );

    return (
      <article
        class={{
          "fitd-actor-sheet": true,
          // "fitd-actor-sheet-grid-container": true,
        }}
        style={{ display: "flex" }}
      >
        <div style={{ flex: "3 1 auto" }} class={{ column: true }}>
          <Grid name="sheet-logo">
            <h1>Scum & Villainy</h1>
          </Grid>
          <Grid
            name="character-details"
            style={{
              marginBottom: "18px",
            }}
          >
            <div class={{ row: true }}>
              <Input
                name="actor.name"
                label="Name"
                value={actor.name}
                onBlur={this._handleUpdateActorEvent("name")}
                style={{ width: "50%" }}
              />
              <Input
                name="data.details.alias"
                label="Alias"
                value={data.details.alias}
                onBlur={this._handleUpdateActorEvent("data.details.alias")}
                style={{ width: "50%" }}
              />
            </div>
            <div class={{ row: true }}>
              <Input
                name="data.details.heritage"
                label="Heritage"
                value={data.details.heritage}
                onBlur={this._handleUpdateActorEvent("data.details.heritage")}
                style={{ width: "50%" }}
              />

              <Input
                name="data.details.background"
                label="Background"
                value={data.details.background}
                onBlur={this._handleUpdateActorEvent("data.details.background")}
                style={{ width: "50%" }}
              />
            </div>
            <div class={{ row: true }}>
              <Input
                name="data.details.vice"
                label="Vice/Purveyor"
                value={data.details.vice}
                onBlur={this._handleUpdateActorEvent("data.details.vice")}
                style={{ width: "100%" }}
              />
            </div>
          </Grid>
          <Grid name="stress-trauma" class={{ row: true }}>
            <Stress
              class={{
                [css({
                  "--fill": "var(--blue02)",
                })]: true,
              }}
              value={data.stress.value}
              min={data.stress.min}
              max={data.stress.max}
              set={(newValue) =>
                this._handleUpdateActorValue("data.stress.value")(
                  toggleRange(newValue, data.stress.value)
                )
              }
            />

            <Trauma
              class={{
                [css({
                  "--fill": "grey",
                  marginLeft: -7.5,
                  marginRight: 7.5,
                  span: {
                    paddingLeft: "10px !important",
                  },
                })]: true,
              }}
              value={data.trauma.value}
              min={data.trauma.min}
              max={data.trauma.max}
              set={(newValue) =>
                this.actor.update({
                  data: {
                    trauma: {
                      value: toggleRange(newValue, data.trauma.value),
                    },
                  },
                })
              }
            />
          </Grid>
          {/** TODO: decide whether I'm still using Grid */}
          <div style={{ marginBottom: "12px" }}>
            <Traumas
              traumas={data.traumas}
              toggleTrauma={(traumaName: string) => {
                const traumaIndex = data.traumas.findIndex(
                  (trauma) => trauma === traumaName
                );
                traumaIndex > -1
                  ? this.actor.update({
                      data: {
                        traumas: arrayWithout(data.traumas, traumaIndex),
                      },
                    })
                  : this.actor.update({
                      data: { traumas: arrayWith(data.traumas, traumaName) },
                    });
              }}
            />
          </div>
          <Grid name="harm-armor-stash">
            <Grid name="harm">
              <header>
                <h5
                  class={{
                    [css({
                      margin: 0,
                      paddingTop: 2,
                      paddingBottom: 2,
                      marginBottom: 4,
                      background: "var(--blue02)",
                    })]: true,
                  }}
                >
                  Harm
                </h5>
              </header>
              <main>
                {data.harm
                  .sort(
                    ({ level: levelA }, { level: levelB }) => levelB - levelA
                  )
                  .map(
                    ({ level, max, penalty, descriptions, ...rest }, idx) => (
                      <div
                        class={{ row: true }}
                        style={{ width: "100%", height: "36px" }}
                      >
                        <label
                          style={{
                            flex: "0 0 12px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: "4px",
                            fontWeight: "700",
                            paddingRight: "4px",
                          }}
                        >
                          {level}
                        </label>
                        {Array(max)
                          .fill(undefined)
                          .map((_, jdx) => (
                            <input
                              style={{
                                flex: "1 1 auto",
                                width: "100%",
                                borderLeft:
                                  jdx !== 0 ? "1px solid white" : undefined,
                              }}
                              props={{
                                value: descriptions![jdx] ?? "",
                              }}
                              on={{
                                blur: (ev) =>
                                  this.actor.update({
                                    data: {
                                      harm: updateArray(data.harm, idx, {
                                        level,
                                        max,
                                        penalty,
                                        descriptions: updateArray(
                                          descriptions,
                                          jdx,
                                          (ev.target as HTMLInputElement).value
                                        ),
                                        ...rest,
                                        value: descriptions.filter(Boolean)
                                          .length,
                                      }),
                                    },
                                  }),
                              }}
                            />
                          ))}
                        <label
                          class={{
                            [css({
                              flex: "0 0 44px",
                              display: "flex",
                              fontVariant: "all-small-caps",
                              fontWeight: 700,
                              alignContent: "center",
                              justifyContent: "center",
                              textAlign: "center",
                            })]: true,
                          }}
                        >
                          {penalty}
                        </label>
                      </div>
                    )
                  )}
              </main>
              <footer
                class={{
                  row: true,
                }}
              >
                <label
                  class={{
                    row: true,
                    [css({
                      background: "var(--blue02)",
                    })]: true,
                  }}
                >
                  <h6
                    style={{ margin: "0" }}
                    title="Get treatment in downtime to fill your healing clock"
                  >
                    Recovery
                  </h6>
                </label>
                <span>CLOCK</span>
              </footer>
            </Grid>
            <Grid name="armor">
              <ul class={{ [unstyleList]: true }}>
                {(data?.armor ?? []).map(
                  ({ name, value, max, min, ...rest }, idx, arr) => (
                    <li
                      class={{
                        row: true,
                        [unstyleList]: true,
                      }}
                      style={{
                        height: "20px",
                        marginBottom: "6px",
                      }}
                    >
                      <h6
                        style={{
                          background: "var(--blue02)",
                          padding: "4px",
                          margin: "0px",
                          display: "flex",
                          alignItems: "center",
                          flexGrow: "1",
                        }}
                      >
                        {name}
                      </h6>
                      <SaVRange
                        element="parallelogram"
                        name={name}
                        value={value}
                        max={max}
                        min={min}
                        set={(newValue) =>
                          this.actor.update({
                            data: {
                              armor: updateArray(arr, idx, {
                                name,
                                max,
                                min,
                                value: toggleRange(newValue, value),
                                ...rest,
                              }),
                            },
                          })
                        }
                      />
                    </li>
                  )
                )}
              </ul>
            </Grid>
            <Grid name="cred-stash">
              <div class={{ [flexRow]: true }}>
                <span class={{ [smallCaps]: true, [bold]: true }}>cred:</span>
                <span>{data.cred.value}</span>
                <span>/</span>
                <span>{data.cred.max}</span>
              </div>
              <div class={{ [flexRow]: true }}>
                <span class={{ [smallCaps]: true, [bold]: true }}>stash:</span>
                <span>{data.stash.value}</span>
                <span>/</span>
                <span>{data.stash.max}</span>
              </div>
            </Grid>
          </Grid>
          <Grid
            name="notes-projects"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h5>Notes/Projects</h5>
            <textarea
              on={{
                blur: (e) =>
                  this.actor.update({
                    data: { notes: (e.target as HTMLTextAreaElement).value },
                  }),
              }}
            >
              {data.notes}
            </textarea>
          </Grid>
          <Grid name="rules-reference-one" style={{ display: "none" }}>
            <section style={{ flex: "1 1 auto" }}>
              <h5>Teamwork</h5>
              <ul class={{ [unstyleList]: true }}>
                <li>
                  Lead a <b>group action</b>
                </li>
                <li>
                  <b>Set up</b> another character
                </li>
                <li>
                  <b>Protect</b> a teammate
                </li>
                <li>
                  <b>Assist</b> another character
                </li>
              </ul>
            </section>
            <section style={{ flex: "1 1 auto" }}>
              <h5>Planning & Load</h5>
              <span>
                Choose a <b>plan</b>. Pick <b>load</b>. Provide <b>detail</b>:
              </span>
              <ul class={{ [unstyleList]: true }}>
                <li>
                  <b>Assault plan:</b> Point of attack.
                </li>
                <li>
                  <b>Deception plan:</b> Method.
                </li>
                <li>
                  <b>Infiltration plan:</b> Entry point.
                </li>
                <li>
                  <b>Mystic plan:</b> Arcane power.
                </li>
                <li>
                  <b>Social plan:</b> Social connection.
                </li>
                <li>
                  <b>Transport plan:</b> Route and means.
                </li>
              </ul>
            </section>
            <section style={{ flex: "1 1 auto" }}>
              <h5>Gather Info</h5>
              <ul class={{ [unstyleList]: true }}>
                <li>What's their intention?</li>
                <li>What might I suspect about this? What can I prove?</li>
                <li>What's the danger here?</li>
                <li>How can I find _____?</li>
                <li>What's really going on here?</li>
                <li>
                  Ask about a <b>detail</b> for a <b>plan</b>.
                </li>
              </ul>
            </section>
          </Grid>
        </div>
        <div style={{ flex: "2 1 auto" }} class={{ column: true }}>
          <Grid name="playbook-details">
            {allActions.length === 0 ? (
              <button
                on={{
                  click: () => {
                    // TODO: this is gross? Do I need to figure out stateful components?
                    let playbook = "";
                    new FSXDialog(
                      {
                        title: "New Move",
                        yes: () => console.log("yes"),
                        no: () => console.log("no"),
                        content: (dialog, data, options) => {
                          return (
                            <div>
                              <SelectPlaybook
                                playbook={playbook}
                                set={(newPlaybook) => (playbook = newPlaybook)}
                              />
                              <button
                                on={{
                                  click: async () => {
                                    console.log(dialog);
                                    try {
                                      await this._instantiateScumAndVillainyCharacter(
                                        playbook
                                      );
                                      dialog.close();
                                    } catch (ex) {
                                      console.error(ex);
                                    }
                                  },
                                }}
                              >
                                Instantiate
                              </button>
                            </div>
                          );
                        },
                        buttons: [],
                      },
                      {
                        // TODO: figure out why this isn't working
                        classes: ["fitd", "scum-and-villainy"],
                      }
                    ).render(true);
                  },
                }}
              >
                fill in data (TODO: turn this into a dialog with a playbook
                dropdown)
              </button>
            ) : (
              <SelectPlaybook
                playbook={data.playbook}
                set={(playbook) =>
                  this.actor.update({ data: { playbook } } as FitDActorSheet)
                }
              />
            )}
          </Grid>
          <Grid name="moves">
            <ul class={{ [unstyleList]: true }}>
              {moves.map(
                ({ _id, name, data: { value, max, description, min } }) => (
                  <li
                    class={{
                      [unstyleList]: true,
                      [horizontalList]: true,
                    }}
                  >
                    <SaVRange
                      element="triangle"
                      name={`move-${name}`}
                      value={value}
                      min={min}
                      max={max}
                      set={async (newValue) => {
                        await this.actor.updateOwnedItem({
                          _id,
                          data: { value: toggleRange(newValue, value) },
                        });
                      }}
                    />
                    <span style={{ flex: "1 1 auto" }}>
                      <b>{name}:</b> <span>{description}</span>
                    </span>
                    <button
                      style={{
                        marginLeft: "auto",
                        height: "30px",
                        width: "30px",
                        padding: "0px",
                        flex: "0 0 auto",
                      }}
                      on={{
                        click: async () =>
                          await this.actor.deleteOwnedItem(_id),
                      }}
                    >
                      <i class={{ fas: true, "fa-trash": true }} />
                    </button>
                  </li>
                )
              )}
            </ul>
            <button
              on={{
                click: () => {
                  // TODO: this is gross? Do I need to figure out stateful components?
                  const move = {
                    name: "",
                    description: "",
                  };
                  new FSXDialog(
                    {
                      title: "New Move",
                      yes: () => console.log("yes"),
                      no: () => console.log("no"),
                      content: (dialog, data, options) => {
                        return (
                          <div>
                            <input
                              props={{ value: move.name }}
                              on={{
                                change: (ev) => {
                                  move.name = (ev.target as HTMLInputElement).value;
                                },
                              }}
                            />
                            <textarea
                              props={{ value: move.description }}
                              on={{
                                change: (ev) => {
                                  move.description = (ev.target as HTMLTextAreaElement).value;
                                },
                              }}
                            >
                              {move.description}
                            </textarea>
                            <button
                              on={{
                                click: async () => {
                                  console.log(dialog);
                                  try {
                                    await this.actor.createOwnedItem({
                                      type: "move",
                                      name: move.name,
                                      data: { description: move.description },
                                    });
                                    dialog.close();
                                  } catch (ex) {
                                    console.error(ex);
                                  }
                                },
                              }}
                            >
                              Add
                            </button>
                          </div>
                        );
                      },
                      buttons: [],
                    },
                    {
                      // TODO: figure out why this isn't working
                      classes: ["fitd", "scum-and-villainy"],
                    }
                  ).render(true);
                },
              }}
            >
              Add Move
            </button>
          </Grid>
          <Grid name="contacts-items-one">contacts, items 1</Grid>
          <Grid name="rules-reference-two" style={{ display: "none" }}>
            Mark XP:
            <ul>
              <li>
                Every time you roll a desparate action, mark xp in that action's
                attribute.
              </li>
            </ul>
            At the end of each session, for each item below, mark 1 xp (in your
            playbook or an attribute) or 2xp if that item occurred multiple
            times.
            <ul>
              <li>You addressed a tough challenge with ___</li>
              <li>
                You expressed your beliefs, drives, heritage, or background.
              </li>
              <li>
                You struggled with issues from your vice or traumas during the
                session.
              </li>
            </ul>
          </Grid>
        </div>
        <div style={{ flex: "1 1 auto" }} class={{ column: true }}>
          <Grid name="actions">
            {[
              { name: "insight", actions: insightActions },
              { name: "prowess", actions: prowessActions },
              { name: "resolve", actions: resolveActions },
            ].map(({ name, actions }) => (
              <ul
                class={{
                  [`fitd-actor-sheet-${name}`]: true,
                  [unstyleList]: true,
                }}
              >
                <li class={{ row: true }} style={{ alignItems: "center" }}>
                  <RollButton
                    fontFamily="Metro"
                    roll={async () => {
                      // @ts-ignore TODO: global typings
                      const roll = FitDRoll(
                        actions.reduce(
                          (acc, { value }) => acc + (value > 0 ? 1 : 0),
                          0
                        ),
                        { type: "fortune" }
                      );
                      console.log(roll);
                      const message = await roll.toMessage();
                      console.log(message);
                    }}
                    name={name}
                  />
                  <SaVRange
                    name={name}
                    element="parallelogram"
                    value={data.xp![name]?.value ?? 0}
                    min={data.xp![name]?.min ?? 0}
                    max={data.xp![name]?.max ?? 0}
                    set={(newValue) =>
                      this.actor.update({
                        data: {
                          xp: {
                            [name]: {
                              value: toggleRange(
                                newValue,
                                data.xp![name]?.value ?? 0
                              ),
                            },
                          },
                        },
                      })
                    }
                  />
                </li>
                {actions.map(({ name, value, max, ...rest }) => (
                  <li>
                    <Action
                      name={name}
                      value={value}
                      max={max}
                      roll={() => {
                        // @ts-ignore TODO: make global declarations
                        const roll = FitDRoll(value, { action: name });
                        console.log(roll);
                        roll.toMessage();
                      }}
                      set={(newValue) => {
                        const idx = allActions.findIndex(
                          ({ name: actionName }) => name === actionName
                        );
                        this.actor.update({
                          data: {
                            actions: updateArray(allActions, idx, {
                              value: newValue,
                              name,
                              max,
                              ...rest,
                            }),
                          },
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </Grid>
          <Grid name="items-two">
            <ul class={{ [unstyleList]: true }}>
              {systemItems.map(
                ({ _id, name, data: { value, max, linked, min } }) => (
                  <Item
                    name={name}
                    value={value}
                    max={max}
                    linked={linked}
                    set={(newValue: number) =>
                      this.actor.updateOwnedItem({
                        _id,
                        data: { value: toggleRange(newValue, value) },
                      })
                    }
                    min={min}
                  />
                )
              )}
            </ul>
          </Grid>
          <Grid name="rules-reference-three" style={{ display: "none" }}>
            <h3>Bonus Dice</h3>
            <ul>
              <li>
                <b class={{ smallcaps: true }}>Push yourself</b> (take 2 stress){" "}
                <b class={{ smallcaps: true }}>-or-</b> accept a{" "}
                <b class={{ smallcaps: true }}>devil's bargain</b>.
              </li>
              <li>
                <b class={{ smallcaps: true }}>Assist</b> (they take 1 stress)
              </li>
              <li>
                <b class={{ smallcaps: true }}>Spend a gambit</b>
              </li>
            </ul>
            <h3>Gambits</h3>
            <ul>
              <li>
                Add a <b>gambit</b> to your crew when you roll a <b>6</b> or{" "}
                <b>critical</b> on a <b>risky</b> action and you didn't{" "}
                <b>spend a gambit</b> on a bonus dice.
              </li>
            </ul>
          </Grid>
        </div>
      </article>
    );
  }

  async _renderInner(data: FitDActorSheet, options) {
    if (
      // Check whether we've already created our vnode and reconciled it into the DOM
      this._vnode &&
      // If the Application has been closed, the element exists but its length is 0
      // and it is no longer a valid target to patch the vnode into
      (this.element as JQuery<HTMLElement>).length
    ) {
      this._vnode = patch(this._vnode, this._renderFSXTemplate(data, options));
    } else {
      this._vnode = patch(
        toVNode(document.createElement("div")),
        this._renderFSXTemplate(data, options)
      );
    }
    // Not sure if it's better to always return the element or only when it's created?
    // @ts-ignore TODO: for some reason I need this for _render to not return early
    // when I use this.entity.update
    this._state = 2;
    return (this._vnode.elm as unknown) as HTMLElement;
  }

  async _instantiateScumAndVillainyCharacter(playbook: string) {
    const actions = [
      { name: "insight", actions: ["doctor", "hack", "rig", "study"] },
      { name: "prowess", actions: ["helm", "scramble", "scrap", "skulk"] },
      { name: "resolve", actions: ["attune", "command", "consort", "sway"] },
    ].flatMap(({ name: attribute, actions }) => {
      return actions.map(
        (actionName) =>
          ({
            name: actionName,
            attribute,
            value: 0,
            min: 0,
            max: 3,
          } as FitDActorSheetDataData["actions"][0])
      );
    });
    const systemItems = [
      { name: "Blaster Pistol" },
      { name: "2nd Blaster Pistol" },
      { name: "Melee Weapon" },
      { name: "Heavy Blaster", linked: true, max: 2 },
      { name: "Detonator" },
      { name: "Hacking Tools" },
      { name: "Repair Tools" },
      { name: "Medkit", linked: true, max: 2 },
      { name: "Spy Gear" },
      { name: "Illicit Drugs", weightless: true },
      { name: "Communicator", weightless: true },
      { name: "Armor", linked: true, max: 2 },
      { name: "Spacesuit", linked: true, max: 2 },
    ].map(({ name, ...data }) => ({
      name,
      type: "item",
      data: {
        ...data,
        source: "default-system",
      },
    }));
    await this.actor.update({
      data: {
        system: "scum-and-villainy",
        details: {
          alias: "",
          heritage: "",
          background: "",
          vice: "",
        },
        xp: {
          insight: { value: 0, min: 0, max: 6 },
          prowess: { value: 0, min: 0, max: 6 },
          resolve: { value: 0, min: 0, max: 6 },
        },
        actions,
        armor: [
          { name: "Armor", min: 0, max: 1, value: 0 },
          { name: "Heavy", min: 0, max: 1, value: 0 },
          { name: "Special", min: 0, max: 1, value: 0 },
        ],
        harm: [
          {
            level: 1,
            value: 0,
            max: 2,
            min: 0,
            descriptions: [],
            penalty: "Less effect",
          },
          {
            level: 2,
            value: 0,
            max: 2,
            min: 0,
            descriptions: [],
            penalty: "-1D",
          },
          {
            level: 3,
            value: 0,
            max: 1,
            min: 0,
            descriptions: [],
            penalty: "Need help",
          },
        ] as FitDActorSheetDataData["harm"],
      },
    });
    const playbookMoves = (moves![playbook] ?? []).map(({ name, ...data }) => ({
      type: "move",
      name,
      data,
    }));
    // I think this is due to a race condition at DB level?
    for (const item of [...systemItems, ...playbookMoves]) {
      try {
        await this.actor.createOwnedItem(item);
      } catch (ex) {
        console.error(`Error creating: '${item.name}'`, ex);
      }
    }
    console.log("Instantiated");
  }

  activateListeners() {}
}

export default FitDScumAndVillainyActorSheet;

Actors.registerSheet("Scum and Villainy", FitDScumAndVillainyActorSheet, {
  makeDefault: true,
});
