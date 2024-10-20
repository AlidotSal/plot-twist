import { Portal } from "solid-js/web";
import { css } from "solid-styled";
import type { NodeI } from "../../types";
import { setStore, store } from "../../store";

interface NodeProps {
  node: NodeI;
}

export default (props: NodeProps) => {
  function handleSelection() {
    const selectedNodes = [props.node.id];
    for (const node of Object.values(store.nodes)) {
      const centerX = (node?.position[0] ?? 0) + (node?.width ?? 0) / 2;
      const centerY = (node?.position[1] ?? 0) + (node?.height ?? 0) / 2;
      if (
        centerX > props.node.position[0] &&
        centerX < props.node.position[0] + props.node.width &&
        centerY > props.node.position[1] &&
        centerY < props.node.position[1] + props.node.height
      ) {
        selectedNodes.push(node.id);
      }
    }
    setStore("selectedNodes", new Set(selectedNodes));
  }

  function handleDrag() {
    setStore("selectedNodes", new Set([props.node.id]));
    setStore("isDragging", true);
  }

  css`
    section {
      width: calc(${props.node.width.toString()} * 1px);
      height: calc(${props.node.height.toString()} * 1px);
      color: ${props.node.textColor || "black"};
      transform: translate(
        calc(${props.node.position[0].toString()} * 1px),
        calc(${props.node.position[1].toString()} * 1px)
      );
    }
  `;

  return (
    <section class="backdrop" classList={{ selected: props.node.selected }}>
      <Portal mount={document.getElementById("rects") ?? undefined} isSVG={true}>
        <rect
          class="rect"
          fill={props.node.bgColor ?? "#adadad"}
          shape-rendering="optimizeSpeed"
          x={props.node.position[0]}
          y={props.node.position[1]}
          width={Math.max(props.node.width, 80)}
          height={Math.max(props.node.height, 80)}
        />
      </Portal>
      <h1 aria-label="label of group" innerHTML={props.node.content} onPointerDown={handleSelection} />
      <span onPointerDown={handleDrag} />
    </section>
  );
};
