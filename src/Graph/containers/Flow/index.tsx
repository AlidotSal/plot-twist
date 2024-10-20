import { StyleRegistry } from "solid-styled";
import GraphView from "../GraphView";
import type { GraphProps } from "../../types";
import "./styles.css";
import { addEdges, addNodes, setStore } from "../../store";
import { createEffect } from "solid-js";

export default (props: GraphProps) => {
  createEffect(() => {
    addNodes(props.nodes);
    addEdges(props.edges);
    setStore("width", props.width ?? "100%");
    setStore("height", props.height ?? "100%");
    setStore("transition", props.transition ?? [0, 0]);
    setStore("scale", props.scale ?? 1);
  });
  return (
    <StyleRegistry>
      <GraphView />
    </StyleRegistry>
  );
};
