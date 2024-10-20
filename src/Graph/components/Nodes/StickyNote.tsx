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
      transform: translate(
          calc(${props.node.position[0].toString()} * 1px),
          calc(${props.node.position[1].toString()} * 1px)
      );
    }
    p {
      width: calc(${props.node.width.toString()} * 1px);
      height: calc(${props.node.height.toString()} * 1px);
      color: ${props.node.textColor ?? "black"};
      font-size: ${props.node.fontSize};
      background-color: ${props.node.bgColor ?? "#dede8c"};
    }
  `;

  return (
    <section class="sticky" onPointerDown={handleClick}>
      <p innerHTML={props.node.content} />
    </section>
  );
};
