/** @jsx jsx */
import { jsx } from "snabbdom-jsx-lite";
import { VNodeData, VNode } from "snabbdom/vnode";
import { css } from "emotion";
import { horizontalList, unstyleList } from "../style";

export const Triangle = (filled: boolean) => (filled ? "►" : "▷");

export const TriangleRange = ({
  value,
  min,
  max,
  set,
  style,
  ...props
}: VNodeData & {
  value: number;
  min: number;
  max: number;
  set: (idx: number) => void;
}) => (
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

export const SaVRange = ({
  value,
  min,
  max,
  set,
  style,
  fancy,
  ...props
}: VNodeData & {
  value: number;
  min: number;
  fancy?: boolean;
  max: number;
  set: (idx: number) => void;
}) => (
  // TODO: see if Fragment exists?
  <span
    {...props}
    style={mergeObject(
      {
        display: "flex",
        alignItems: "center",
      },
      style
    )}
    class={{ "fitd-actor-sheet-range": true }}
  >
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
    <datalist
      props={{ id: `${name}-list` }}
      class={{
        [css({
          "::after": {
            display: "block",
            content: "''",
            width: 20,
            background: "var(--fill)",
            marginLeft: -7.5,
          },
        })]: fancy,
      }}
    >
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
  class: classes,
  fancy = false,
  ...props
}: VNodeData & {
  name: string;
  value: number;
  min: number;
  max: number;
  fancy?: boolean;
  set: (idx: number) => void;
}) => (
  <h3
    {...props}
    class={{
      ...classes,
      [css({
        flex: "0 0 auto",
        position: "relative",
        color: "white",
        display: "flex",
        height: "fit-content",
        marginBottom: "8px",
        ...(fancy
          ? {
              "::after": {
                display: "block",
                content: "''",
                position: "absolute",
                right: 0,
                borderTop: "12.5px solid transparent",
                borderBottom: "12.5px solid transparent",
                borderLeft: "7.5px solid var(--fill)",
                zIndex: 1,
              },
            }
          : {}),
      })]: true,
    }}
  >
    {fancy && (
      <span
        class={{
          [css({
            background: "var(--fill)",
            padding: 2,
            paddingRight: 24,
          })]: true,
        }}
      >
        {name}
      </span>
    )}
    <SaVRange
      value={value}
      fancy={fancy}
      set={set}
      min={min}
      max={max}
      style={
        fancy
          ? {
              marginLeft: "-15px",
              marginRight: "7.5px",
            }
          : {}
      }
    />
  </h3>
);

export const Stress = (
  props: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  }
) => <HorizontalTrack {...props} name="Stress" fancy />;

export const Trauma = (
  props: VNodeData & {
    value: number;
    min: number;
    max: number;
    set: (idx: number) => void;
  }
) => <HorizontalTrack {...props} name="Trauma" fancy />;

export const Traumas = ({
  traumas,
  toggleTrauma,
}: {
  traumas: string[];
  toggleTrauma: (traumaName: string) => void;
}) => (
  <div>
    {[
      [
        ...["cold", "haunted", "obsessed", "paranoid"],
        ...["reckless", "soft", "unstable", "vicious"],
      ],
    ].map((row) => (
      <ul
        style={{
          flexWrap: "no-wrap",
          height: "fit-content",
        }}
        class={{
          [unstyleList]: true,
          [horizontalList]: true,
        }}
      >
        {row.flatMap((traumaName, idx, arr) => [
          <li
            class={{
              selected: traumas.includes(traumaName),
              [css({
                fontWeight: traumas.includes(traumaName) ? 800 : 200,
                flex: "1 1 auto",
                // Not sure why I need this. For some reason the nbsp's are fucking with line height?
                height: "14px",
                textAlign: "center",
                fontVariant: "all-small-caps",
                ":not(:first-child)": {
                  paddingLeft: "2px",
                },
                ":not(:last-child)": {
                  paddingRight: "2px",
                },
              })]: true,
            }}
            on={{ click: () => toggleTrauma(traumaName) }}
          >
            {traumaName}
          </li>,
          ...(idx !== arr.length - 1 ? [<li>–</li>] : []),
        ])}
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
      class={{
        [unstyleList]: true,
        [horizontalList]: true,
      }}
      style={{
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

export const RollButton = ({
  roll,
  name,
  on,
  style,
  fontFamily,
  ...props
}: VNodeData & { name: string; fontFamily?: "Metro" | "Exo" }) => (
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

export const Input = ({
  label,
  name,
  type = "text",
  props,
  value,
  onBlur,
  on,
  style,
}: VNodeData &
  Record<"name" | "value", string> &
  Partial<Record<"placeholder" | "label", string>> & {
    type?: "text";
    onBlur: (e: FocusEvent) => void;
  }): VNode => {
  return (
    <div style={style}>
      <input
        props={{
          ...props,
          type,
          value,
          name,
        }}
        on={{
          ...on,
          blur: onBlur,
        }}
      />
      <label
        style={{
          fontVariant: "all-small-caps",
          fontWeight: "800",
          fontSize: "11px",
          display: "block",
          marginTop: "-2px",
          marginBottom: "2px",
        }}
      >
        {label}
      </label>
    </div>
  );
};
