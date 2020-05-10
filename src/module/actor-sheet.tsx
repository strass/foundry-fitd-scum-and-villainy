/** @jsx jsx */
import { jsx } from "../snabbdom/jsx.js";
import type { VNode } from "../snabbdom/vnode.js";
import toVNode from "../snabbdom/tovnode.js";
import patch from "../fitd-scum-and-villainy";
import type FITD_TEMPLATE from "../../../fitd/src/template.json";
import Grid from "./Grid.js";
import {
  Stress,
  Trauma,
  Traumas,
  Action,
  SelectPlaybook,
  Item,
  SaVRange,
  RollButton,
} from "./components.js";

interface FitDItemData
  extends Omit<typeof FITD_TEMPLATE["Item"], "types" | "templates"> {}

type FitDItems = {
  [K in keyof FitDItemData]: Item & { data: FitDItemData[K] };
};

type ASD = ActorSheetData["data"];
type PC = typeof FITD_TEMPLATE["Actor"]["pc"];
interface FitDActorSheetDataData extends ASD, PC {
  traumas: string[];
  xp: Partial<
    Record<
      "insight" | "prowess" | "resist",
      { value: number; max: number; min: number }
    >
  >;
}

type FitDActorSheet = ActorSheetData & {
  data: FitDActorSheetDataData;
};

export class FitDScumAndVillainyActorSheet extends ActorSheet {
  _vnode: VNode;
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fitd", "sheet", "actor"],
      width: 1200,
      height: 1000,
    });
  }

  // This is where you write your app in JSX.
  _renderFSXTemplate({ actor, data }: FitDActorSheet, options): VNode {
    console.log(actor, options);

    const armor: FitDItems["armor"][] = actor.items.filter(
      ({ type }) => type === "armor"
    ) as any;

    const items: FitDItems["item"][] = actor.items.filter(
      ({ type }) => type === "item"
    ) as any;
    const systemItems = items.filter(
      ({ data: { source } }) => source === "default-system"
    );
    const actions: FitDItems["action"][] = actor.items.filter(
      ({ type }) => type === "action"
    ) as any;
    const insightActions = actions.filter(
      ({ data: { attribute } }) => attribute === "insight"
    );
    const prowessActions = actions.filter(
      ({ data: { attribute } }) => attribute === "prowess"
    );
    const resolveActions = actions.filter(
      ({ data: { attribute } }) => attribute === "resolve"
    );
    const otherActions = actions.filter(
      ({ data: { attribute } }) =>
        !["insight", "prowess", "resolve"].includes(attribute)
    );
    return (
      <article
        class={{
          "fitd-actor-sheet": true,
          "fitd-actor-sheet-grid-container": true,
        }}
      >
        <Grid name="sheet-logo">
          <img
            props={{
              src:
                "https://assets0.dostuffmedia.com/uploads/aws_asset/aws_asset/3149708/f7f83b9b-6d63-4817-acee-fd7439cacf9a.jpg",
            }}
          />
        </Grid>
        <Grid name="character-details">
          <div class={{ row: true }}>
            <input
              props={{ placeholder: "Name", value: actor.name, type: "text" }}
            />
            <input
              props={{
                placeholder: "Alias",
                type: "text",
                // value: actor.data.alias
              }}
            />
          </div>
          <div class={{ row: true }}>
            <input
              props={{
                placeholder: "Heritage",
                type: "text",
                // value: actor.data.heritage,
              }}
            />
            <input
              props={{
                placeholder: "Background",
                type: "text",
                // value: actor.data.background,
              }}
            />
          </div>
          <div class={{ row: true }}>
            <input
              props={{
                placeholder: "Vice",
                type: "text",
                // value: actor.data.vice,
              }}
            />
            <input
              props={{
                placeholder: "Purveyor",
                type: "text",
                // value: actor.data.purveyor,
              }}
            />
          </div>
        </Grid>
        <Grid name="stress-trauma" class={{ row: true }}>
          <Stress
            value={data.stress.value}
            min={data.stress.min}
            max={data.stress.max}
            set={(newValue) =>
              this.actor.update({ data: { stress: { value: newValue } } })
            }
          />
          <Trauma
            value={data.trauma.value}
            min={data.trauma.min}
            max={data.trauma.max}
            set={(newValue) =>
              this.actor.update({ data: { trauma: { value: newValue } } })
            }
          />
          <Traumas
            traumas={data.traumas}
            toggleTrauma={(traumaName: string) => {
              const traumaIndex = data.traumas.findIndex(
                (trauma) => trauma === traumaName
              );
              traumaIndex > -1
                ? this.actor.update({
                    data: {
                      traumas: [
                        ...data.traumas.slice(0, traumaIndex),
                        ...data.traumas.slice(traumaIndex + 1),
                      ],
                    },
                  })
                : this.actor.update({
                    data: { traumas: [...data.traumas, traumaName] },
                  });
            }}
          />
        </Grid>
        <Grid name="recovery-armor-stash">
          <div>
            <h4>HARM</h4>
          </div>
          <div>recovery clock</div>
          <div>
              TODO: move armor into data, instantiation 
              // CONFIG.debug.hooks = true
            <ul>
              {armor.map(({ _id, name, data: { value, max, min } }) => (
                <li>
                  <span>{name}</span>
                  <SaVRange
                    value={value}
                    max={max}
                    min={min}
                    set={(value) =>
                      this.actor.updateOwnedItem({ _id, data: { value } })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>cred/stash</div>
        </Grid>
        <Grid
          name="notes-projects"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h2>Notes/Projects</h2>
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
        <Grid name="playbook-details">
          {actions.length === 0 ? (
            <button
              on={{ click: () => this._instantiateScumAndVillainyCharacter() }}
            >
              fill in data
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
        <Grid name="moves">moves</Grid>
        <Grid name="actions">
          {[
            { name: "insight", actions: insightActions },
            { name: "prowess", actions: prowessActions },
            { name: "resolve", actions: resolveActions },
          ].map(({ name, actions }) => (
            <ul
              class={{ [`fitd-actor-sheet-${name}`]: true }}
              style={{ listStyle: "none" }}
            >
              <li class={{ row: true }}>
                <RollButton
                  roll={async () => {
                    console.log(actions);
                    // @ts-ignore TODO: global typings
                    const roll = await new FitDRoll(
                      actions.reduce(
                        (acc, { data: { value } }) => acc + (value > 0 ? 1 : 0),
                        0
                      )
                    );
                    console.log(roll);
                    await roll.toMessage();
                  }}
                  name={name}
                />
                <SaVRange
                  value={data.xp![name]?.value ?? 0}
                  min={data.xp![name]?.min ?? 0}
                  max={data.xp![name]?.max ?? 0}
                  set={(newValue) =>
                    this.actor.update({
                      data: { xp: { [name]: { value: newValue } } },
                    })
                  }
                />
              </li>
              {actions.map(({ id, _id, name, data: { value, max } }) => (
                <li>
                  <Action
                    name={name}
                    value={value}
                    max={max}
                    roll={() => {
                      // @ts-ignore TODO: make global declarations
                      const roll = new FitDRoll(value);
                      console.log(roll);
                      roll.toMessage();
                    }}
                    set={(newValue) => {
                      this.actor.updateOwnedItem({
                        _id,
                        data: { value: newValue },
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
          ))}
          {otherActions.length > 0 && (
            <ul class={{ "fitd-actor-sheet-misc": true }}>
              {otherActions.map(({ name, data: { value, max, min } }) => (
                <li>
                  {name}: {value}/{max}
                </li>
              ))}
            </ul>
          )}
        </Grid>
        <Grid name="items-two">
          <ul>
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
                      data: { value: newValue },
                    })
                  }
                  min={min}
                />
              )
            )}
          </ul>
        </Grid>
        <Grid name="contacts-items-one">contacts, items 1</Grid>
        <Grid name="rules-reference-one">
          <h3>Teamwork</h3>
          <ul>
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
        </Grid>
        <Grid name="rules-reference-two">
          Mark XP:
          <ul>
            <li>
              Every time you roll a desparate action, mark xp in that action's
              attribute.
            </li>
          </ul>
          At the end of each session, for each item below, mark 1 xp (in your
          playbook or an attribute) or 2xp if that item occurred multiple times.
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
        <Grid name="rules-reference-three">
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
      </article>
    );
  }

  async _renderInner(data: FitDActorSheet, options) {
    console.log("renderInner");
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

  async _instantiateScumAndVillainyCharacter() {
    const actions = [
      { name: "insight", actions: ["doctor", "hack", "rig", "study"] },
      { name: "prowess", actions: ["helm", "scramble", "scrap", "skulk"] },
      { name: "resolve", actions: ["attune", "command", "consort", "sway"] },
    ].flatMap(({ name: attribute, actions }) => {
      return actions.map((actionName) => ({
        name: actionName,
        type: "action",
        data: {
          attribute,
          value: 0,
          min: 0,
          max: 3,
        } as FitDItems["action"]["data"],
      }));
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
        xp: {
          insight: { value: 0, min: 0, max: 6 },
          prowess: { value: 0, min: 0, max: 6 },
          resolve: { value: 0, min: 0, max: 6 },
        },
      },
    });
    // I think this is due to a race condition at DB level?
    for (const item of [...actions, ...systemItems]) {
      await this.actor.createOwnedItem(item);
    }
    console.log("Instantiated");
  }
  activateListeners() {}
}

export default FitDScumAndVillainyActorSheet;

Actors.registerSheet("Scum and Villainy", FitDScumAndVillainyActorSheet, {
  makeDefault: true,
});
