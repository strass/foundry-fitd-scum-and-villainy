/** @jsx jsx */
import { jsx } from "../snabbdom/jsx.js";
import { VNodeData, VNode } from "../snabbdom/vnode.js";
import { horizontalList, unstyleList } from "./styles.js";

export const SaVRange = (
  {
    value,
    min,
    max,
    set,
  }: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  },
  children?: Array<VNode | string>
) => (
  <span>
    <input
      props={{
        type: "range",
        name,
        value,
        min,
        max,
        // list: `${name}-list`,
      }}
      class={{ "fitd-actor-sheet-range": true }}
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

// TODO: combine stress + trauma into generic component
export const Stress = ({
  value,
  set,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
  set: (idx: number) => void;
}) => (
  <div>
    <h2>Stress</h2>
    <SaVRange value={value} set={set} min={min} max={max} />
  </div>
);
export const Trauma = ({
  value,
  set,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
  set: (idx: number) => void;
}) => (
  <div>
    <h2>Trauma</h2>
    <SaVRange value={value} set={set} min={min} max={max} />
  </div>
);
export const Traumas = ({
  traumas,
  toggleTrauma,
}: {
  traumas: string[];
  toggleTrauma: (traumaName: string) => void;
}) => (
  <ul>
    {[
      "cold",
      "haunted",
      "obsessed",
      "paranoid",
      "reckless",
      "soft",
      "unstable",
      "vicious",
    ].map((traumaName) => (
      <li
        class={{ selected: traumas.includes(traumaName) }}
        style={{ fontWeight: traumas.includes(traumaName) ? "bold" : "normal" }}
        on={{ click: () => toggleTrauma(traumaName) }}
      >
        {traumaName}
      </li>
    ))}
  </ul>
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
    <ol style={{ ...horizontalList, ...unstyleList }}>
      {Array(max)
        .fill(undefined)
        .map((_, idx) => (
          <li
            on={{ click: () => set(value === idx + 1 ? idx : idx + 1) }}
            style={{
              width: "1em",
              height: "100%",
              borderRight: idx === 0 ? "1px solid black" : undefined,
              display: "flex",
              alignItems: "center",
            }}
          >
            {value >= idx + 1 ? "►" : "▷"}
          </li>
        ))}
    </ol>
    <RollButton roll={roll} name={name} />
  </div>
);

export const RollButton = (
  { roll, name, on, style, ...props }: VNodeData,
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
      },
      style
    )}
  >
    {name}
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

export const TriangleSVGPolygon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24">
    <polygon points="0,0 24,12 0,24" />
  </svg>
);
