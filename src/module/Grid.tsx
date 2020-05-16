/** @jsx jsx */
import { jsx } from "snabbdom-jsx-lite";
import type { VNodeData } from "snabbdom/vnode";

export default (
  { class: className, name, ...props }: VNodeData & { name: string },
  children
) => {
  return (
    <section
      class={mergeObject<VNodeData["class"]>(
        {
          [`fitd-actor-sheet-${name}`]: true,
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
