import { css } from "solid-styled";
import type { NodeI } from "../../types";
import { setStore } from "../../store";

interface NodeProps {
  node: NodeI;
}

export default (props: NodeProps) => {
  function handleClick() {
    setStore("selectedNodes", (p) => (p.has(props.node.id) ? p : new Set([props.node.id])));
  }

  css`
    section {
      width: calc(${props.node.width.toString()} * 1px);
      height: calc(${props.node.height.toString()} * 1px);
      background-color: ${props.node.bgColor ?? "var(--nodeBG)"};
      outline: 1px solid ${props.node.borderColor ?? "var(--nodeBR)"};
      transform: translate(
        calc(${props.node.position[0].toString()} * 1px),
        calc(${props.node.position[1].toString()} * 1px)
      );
    }
  `;

  return (
    <section id={props.node.id} class="dot" classList={{ selected: props.node.selected }} onPointerDown={handleClick} />
  );
};
