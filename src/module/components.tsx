/** @jsx jsx */
import { jsx } from "../snabbdom/jsx.js";
import { VNodeData, VNode } from "../snabbdom/vnode.js";
import { horizontalList, unstyleList } from "./styles.js";

export const Triangle = (filled: boolean) => (filled ? "►" : "▷");

export const TriangleRange = (
  {
    value,
    min,
    max,
    set,
    fontFamily,
    style,
    ...props
  }: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  },
  children?: never
) => (
  // TODO: see if Fragment exists?
  <span
    {...props}
    style={mergeObject({ display: "inline-flex" }, style)}
    class={{ "fitd-actor-sheet-triangle-range": true }}
  >
    <input
      props={{
        type: "range",
        name,
        value,
        min,
        max,
        // list: `${name}-list`,
      }}
    />
    <datalist props={{ id: `${name}-list` }}>
      {Array(max)
        .fill(undefined)
        .map((_, idx) => (
          <option
            on={{ click: () => set(idx + 1) }}
            class={{ active: value >= idx + 1 }}
          >
            {Triangle(value >= idx + 1)}
          </option>
        ))}
    </datalist>
  </span>
);

export const SaVRange = (
  {
    value,
    min,
    max,
    set,
    fontFamily,
    ...props
  }: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  },
  children?: Array<VNode | string>
) => (
  // TODO: see if Fragment exists?
  <span {...props} class={{ "fitd-actor-sheet-range": true }}>
    <input
      props={{
        type: "range",
        name,
        value,
        min,
        max,
      }}
      attrs={{
        list: `${name}-list`,
      }}
    />
    <datalist props={{ id: `${name}-list` }}>
      {Array(max)
        .fill(undefined)
        .map((_, idx) => (
          <option
            on={{ click: () => set(idx + 1) }}
            class={{ active: value >= idx + 1 }}
          >
            {idx}
          </option>
        ))}
    </datalist>
  </span>
);

export const HorizontalTrack = ({
  name,
  value,
  set,
  min,
  max,
  style,
  ...props
}: VNodeData & {
  name: string;
  value: number;
  min: number;
  max: number;
  set: (idx: number) => void;
}) => (
  <div
    {...props}
    style={mergeObject({ display: "flex", height: "fit-content" }, style)}
  >
    <h3 style={{ background: "white", color: "black", display: "flex" }}>
      <span>{name}</span>
      <SaVRange
        value={value}
        set={set}
        min={min}
        max={max}
        style={{
          background: "black",
          marginLeft: "4px",
          paddingLeft: "6px",
          paddingRight: "6px",
        }}
      />
    </h3>
  </div>
);

export const Stress = (
  props: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  }
) => <HorizontalTrack {...props} name="Stress" />;

export const Trauma = (
  props: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  }
) => <HorizontalTrack {...props} name="Trauma" />;

export const Traumas = (
  {
    traumas,
    toggleTrauma,
  }: {
    traumas: string[];
    toggleTrauma: (traumaName: string) => void;
  },
  children: never
) => (
  <div>
    {[
      ["cold", "haunted", "obsessed", "paranoid"],
      ["reckless", "soft", "unstable", "vicious"],
    ].map((row) => (
      <ul
        style={{
          ...(horizontalList as any),
          ...(unstyleList as any),
          flexWrap: "no-wrap",
          height: "fit-content",
        }}
      >
        {row.map((traumaName, idx, arr) => (
          <li
            class={{ selected: traumas.includes(traumaName) }}
            style={{
              fontWeight: traumas.includes(traumaName) ? "500" : "300",
              flex: "1 1 25%",
              // Not sure why I need this. For some reason the nbsp's are fucking with line height?
              height: "14px",
              textAlign: "center",
              fontVariant: "all-small-caps",
            }}
            on={{ click: () => toggleTrauma(traumaName) }}
          >
            {`${traumaName}${idx !== arr.length - 1 ? "\u00A0–\u00A0" : ""}`}
          </li>
        ))}
      </ul>
    ))}
  </div>
);

export const Action = ({
  name,
  value,
  max,
  roll,
  set,
}: {
  name: string;
  value: number;
  max: number;
  roll: () => void;
  set: (newValue: number) => void;
}) => (
  <div class={{ row: true }}>
    <ol
      style={{
        ...(horizontalList as any),
        ...(unstyleList as any),
        alignItems: "center",
      }}
    >
      {Array(max)
        .fill(undefined)
        .map((_, idx) => (
          <li
            on={{ click: () => set(value === idx + 1 ? idx : idx + 1) }}
            style={{
              width: "1em",
              height: "100%",
              borderRight: idx === 0 ? "1px solid white" : undefined,
              display: "flex",
              alignItems: "center",
            }}
          >
            {value >= idx + 1 ? "►" : "▷"}
          </li>
        ))}
    </ol>
    <RollButton fontFamily="Exo" roll={roll} name={name} />
  </div>
);

export const RollButton = (
  {
    roll,
    name,
    on,
    style,
    fontFamily,
    ...props
  }: VNodeData & { name: string; fontFamily?: "Metro" | "Exo" },
  children: never
) => (
  <button
    {...props}
    on={mergeObject({ click: roll }, on)}
    style={mergeObject(
      {
        border: "none",
        appearance: "none",
        background: "none",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: fontFamily,
        fontVariant: "all-small-caps",
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "100%",
      },
      style
    )}
  >
    {name.capitalize()}
  </button>
);

export const SelectPlaybook = ({
  playbook,
  set,
}: VNodeData & { playbook: string; set: (newPlaybook: string) => void }) => {
  return (
    <div>
      <select
        props={{ value: playbook }}
        on={{
          change: (e) => {
            set((e.target as HTMLSelectElement).value);
          },
        }}
      >
        <option
          props={{
            // TODO: figure out how to get empty string to display properly in snabbdom
            value: "",
            disabled: true,
            selected: !playbook,
          }}
        >
          Playbook
        </option>
        {[
          "mechanic",
          "muscle",
          "mystic",
          "pilot",
          "scoundrel",
          "speaker",
          "stitch",
        ].map((playbookName) => (
          <option
            props={{ value: playbookName, selected: playbookName === playbook }}
          >
            {playbookName}
          </option>
        ))}
      </select>
    </div>
  );
};

const ItemBoxes = ({
  value,
  set,
  min,
  max,
  linked,
  ...props
}: VNodeData & {
  value: number;
  set: () => void;
  min: number;
  max: number;
  linked: boolean;
}) => (
  <SaVRange
    {...props}
    value={value}
    set={set}
    min={min}
    max={max}
    linked={linked}
  />
);

export const Item = ({
  name,
  value,
  max,
  linked,
  set,
  min,
  style,
  ...props
}: VNodeData & {
  name: string;
  value: number;
  max: number;
  linked: boolean;
  min: number;
  set: (newValue: number) => void;
}) => (
  <li {...props} style={mergeObject({ display: "flex" }, style)}>
    <SaVRange max={max} value={value} linked={linked} set={set} min={min} />{" "}
    {name}
  </li>
);
