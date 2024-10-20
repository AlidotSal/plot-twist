import { Show } from "solid-js";
import { css } from "solid-styled";
import type { NodeI } from "../../types";
import { setStore, store } from "../../store";

interface NodeProps {
  node: NodeI;
}

export default (props: NodeProps) => {
  function handleClick(e: PointerEvent) {
    if (store.selectedNodes.has(props.node.id)) return;
    setStore("selectedNodes", new Set([]));
    setStore("selectedNodes", (p) => {
      let selected = new Set(p);
      if (e.ctrlKey) selected.add(props.node.id);
      if (!selected.has(props.node.id)) selected = new Set([props.node.id]);
      return selected;
    });
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
      font-size: ${props.node.fontSize};
      color: ${props.node.textColor ?? "var(--nodeC)"};
      background-color: ${props.node.bgColor ?? "var(--nodeBG)"};
      border-radius: calc(${(props.node.borderRadius ?? 5).toString()} * 1px);
      border: 2px solid ${props.node.borderColor ?? "var(--nodeBR)"};
    }
    span {
      background-color: ${props.node.bgColor ?? "var(--nodeBG)"};
      outline: 1px solid ${props.node.borderColor ?? "var(--nodeBR)"};
    }
    .input {
      top: calc(
        ${
          props.node.inputPosition === "bottom"
            ? (props.node.height - 5).toString()
            : props.node.inputPosition === "top"
              ? "-3"
              : (props.node.height / 2 - 4).toString()
        } * 1px
      );
      left: calc(
        ${
          props.node.inputPosition === "right"
            ? (props.node.width - 5).toString()
            : props.node.inputPosition === "left"
              ? "-3"
              : (props.node.width / 2 - 4).toString()
        } * 1px
      );
    }
    .output {
      top: calc(
        ${
          props.node.outputPosition === "bottom"
            ? (props.node.height - 5).toString()
            : props.node.outputPosition === "top"
              ? "-3"
              : (props.node.height / 2 - 4).toString()
        } * 1px
      );
      left: calc(
        ${
          props.node.outputPosition === "right"
            ? (props.node.width - 5).toString()
            : props.node.outputPosition === "left"
              ? "-3"
              : (props.node.width / 2 - 4).toString()
        } * 1px
      );
    }
  `;

  return (
    <section class="default" classList={{ selected: props.node.selected }} onPointerDown={handleClick}>
      <Show when={props.node.inputHandle}>
        <span class="input" />
      </Show>
      <p id={props.node.id} innerHTML={props.node.content} />
      <Show when={props.node.outputHandle}>
        <span class="output" />
      </Show>
    </section>
  );
};
