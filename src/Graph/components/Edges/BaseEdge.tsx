import { Show } from "solid-js";
import { css } from "solid-styled";
import type { EdgeProps } from "../../types";
import EdgeText from "./EdgeText";
import { setStore } from "../../store";

interface BaseProps {
  baseEdgeProps: EdgeProps;
  arrowDistance: number;
}

export default function BaseEdge(props: BaseProps) {
  function handleClick() {
    setStore("selectedEdges", new Set([]));
    setStore("selectedEdges", new Set([props.baseEdgeProps.id]));
  }

  css`
    path {
      stroke: ${props.baseEdgeProps.style?.stroke ?? "var(--edgeC)"};
    }
    .arrow {
      offset-path: path(${`"${props.baseEdgeProps.path}"`});
      offset-distance: ${`calc(100% - ${props.arrowDistance + 20}px)`};
    }
  `;

  return (
    <>
      <path
        classList={{ selected: props.baseEdgeProps.selected }}
        onPointerDown={handleClick}
        class={props.baseEdgeProps.animated ? "animated" : ""}
        d={props.baseEdgeProps.path}
        fill="transparent"
        stroke-linecap="round"
        stroke-width="var(--edgeW)"
        aria-label="svg-path"
        {...props.baseEdgeProps.style}
      />
      <Show when={props.baseEdgeProps.arrow}>
        <polygon
          class="arrow"
          points="5 20, 10 0, 0 0"
          fill={props.baseEdgeProps.style?.stroke}
          stroke={props.baseEdgeProps.style?.stroke}
        />
      </Show>
      <Show when={props.baseEdgeProps.label}>
        <EdgeText
          label={props.baseEdgeProps.label ?? "edge label"}
          style={props.baseEdgeProps.labelStyle}
          path={props.baseEdgeProps.path}
        />
      </Show>
    </>
  );
}
