// @ts-nocheck
import { For, Show, Switch, Match } from "solid-js";
import { produce } from "solid-js/store";
import { css } from "solid-styled";
import { setStore, store } from "../../Graph/store";

export default () => {
  const nodeProps = {
    content: "string",
    x: "number",
    y: "number",
    inputPosition: "string",
    outputPosition: "string",
    width: "number",
    height: "number",
    inputHandle: "checkbox",
    outputHandle: "checkbox",
    fontSize: "string",
    textColor: "color",
    bgColor: "color",
    borderColor: "color",
    borderRadius: "number",
  };
  const edgeProps = {
    label: "string",
    type: "string",
    animated: "checkbox",
    arrow: "checkbox",
    "style.stroke": "color",
    "labelStyle.color": "color",
    "labelStyle.background-color": "color",
  };

  function changeNodeAttr(id: string, attribute: string, value: string, e: InputEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (value === "") return;
    const propertyType = nodeProps[attribute];
    setStore(
      "nodes",
      produce((n) => {
        if (propertyType === "number") {
          if (attribute === "x" || attribute === "y")
            n[id].position[attribute === "x" ? 0 : "1"] = Number.parseInt(value);
          else n[id][attribute] = Number.parseInt(value);
        } else if (propertyType === "checkbox") {
          n[id][attribute] = e?.target?.checked;
        } else {
          n[id][attribute] = value;
        }
      }),
    );
  }
  function changeEdgeAttr(id: string, attribute: string, value: string, event: InputEvent) {
    event.stopImmediatePropagation();
    if (value === "") return;
    setStore(
      "edges",
      produce((e) => {
        switch (edgeProps[attribute]) {
          case "number":
            e[id][attribute] = Number.parseInt(value);
            break;
          case "checkbox":
            e[id][attribute] = event?.target?.checked;
            break;
          default:
            if (attribute.includes(".")) e[id][attribute.split(".")[0]][attribute.split(".")[1]] = value;
            e[id][attribute] = value;
        }
      }),
    );
  }
  function clearAtrr() {
    const attrs = [...document.getElementsByClassName("attributes")];
    for (let i = 0; i < attrs.length; i++) {
      attrs[i].remove();
    }
  }

  css`
      .attributes.node {
          border-top: 2px solid ${store.nodes[store.selectedNodes.keys().next()?.value]?.bgColor ?? "white"};
      }
      .attributes.edge {
          border-top: 2px solid ${store.edges[store.selectedEdges.keys().next()?.value]?.style?.stroke ?? "white"};
      }
  `;

  return (
    <>
      <div>
        <span class="clear" onClick={clearAtrr}>
          x
        </span>
        <Show when={store.selectedNodes.size !== 0}>
          <div class="attributes node">
            <div class="group-title">
              <p>Node</p>
              <div class="divider" />
            </div>
            <For each={Object.keys(nodeProps)}>
              {(attr) => (
                <div>
                  <Show when={attr !== "x" && attr !== "y"} fallback={<span>position-{attr}</span>}>
                    <span>{attr.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                  </Show>
                  <Switch
                    fallback={
                      <input
                        type={nodeProps[attr]}
                        value={store.nodes[store.selectedNodes.keys().next().value][attr] ?? ""}
                        onInput={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                      />
                    }
                  >
                    <Match when={attr === "content"}>
                      <textarea
                        value={store.nodes[store.selectedNodes.keys().next().value][attr]}
                        onInput={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                      />
                    </Match>
                    <Match when={attr === "x" || attr === "y"}>
                      <input
                        type={nodeProps[attr]}
                        value={store.nodes[store.selectedNodes.keys().next().value].position[attr === "x" ? 0 : "1"]}
                        onInput={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                      />
                    </Match>
                    <Match when={attr === "inputHandle" || attr === "outputHandle"}>
                      <input
                        type={nodeProps[attr]}
                        value={store.nodes[store.selectedNodes.keys().next().value][attr]}
                        onInput={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                        checked={store.nodes[store.selectedNodes.keys().next().value][attr]}
                      />
                    </Match>
                    <Match when={attr === "inputPosition" || attr === "outputPosition"}>
                      <select
                        name="type"
                        onChange={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                      >
                        <option
                          value="top"
                          selected={store.nodes[store.selectedNodes.keys().next().value]?.[attr] === "top"}
                        >
                          Top
                        </option>
                        <option
                          value="bottom"
                          selected={store.nodes[store.selectedNodes.keys().next().value]?.[attr] === "bottom"}
                        >
                          Bottom
                        </option>
                        <option
                          value="left"
                          selected={store.nodes[store.selectedNodes.keys().next().value]?.[attr] === "left"}
                        >
                          Left
                        </option>
                        <option
                          value="right"
                          selected={store.nodes[store.selectedNodes.keys().next().value]?.[attr] === "right"}
                        >
                          Right
                        </option>
                      </select>
                    </Match>
                    <Match when={attr.includes("Color")}>
                      <input
                        type={nodeProps[attr]}
                        value={store.nodes[store.selectedNodes.keys().next().value][attr] ?? "#000000"}
                        onInput={(e) =>
                          changeNodeAttr(store.selectedNodes.keys().next().value, attr, e.target.value, e)
                        }
                      />
                    </Match>
                  </Switch>
                </div>
              )}
            </For>
          </div>
        </Show>
        <Show when={store.selectedEdges.size > 0}>
          <div class="attributes edge">
            <div class="group-title">
              <p>Edge</p>
              <div class="divider" />
            </div>
            <For each={Object.keys(edgeProps)}>
              {(attr) => (
                <>
                  <Show when={attr === "labelStyle.color"}>
                    <div class="group-title">
                      <p>Label</p>
                      <div class="divider" />
                    </div>
                  </Show>
                  <div>
                    <span>{attr.split(".").at(-1)}</span>
                    <Show
                      when={attr === "type"}
                      fallback={
                        <input
                          type={edgeProps[attr]}
                          value={
                            attr.includes(".")
                              ? store.edges[store.selectedEdges.keys().next().value][attr.split(".")[0]][
                                  attr.split(".")[1]
                                ]
                              : (store.edges[store.selectedEdges.keys().next().value][attr] ?? "")
                          }
                          onInput={(e) =>
                            changeEdgeAttr(store.selectedEdges.keys().next().value, attr, e.target.value, e)
                          }
                          checked={store.edges[store.selectedEdges.keys().next().value][attr]}
                        />
                      }
                    >
                      <select
                        name="type"
                        onChange={(e) =>
                          changeEdgeAttr(store.selectedEdges.keys().next().value, attr, e.target.value, e)
                        }
                      >
                        <option
                          value="bezier"
                          selected={store.edges[store.selectedEdges.keys().next().value].type === "bezier"}
                        >
                          Bezier
                        </option>
                        <option
                          value="straight"
                          selected={store.edges[store.selectedEdges.keys().next().value].type === "straight"}
                        >
                          Straight
                        </option>
                        <option
                          value="smoothStep"
                          selected={store.edges[store.selectedEdges.keys().next().value].type === "smoothStep"}
                        >
                          Smooth Step
                        </option>
                        <option
                          value="step"
                          selected={store.edges[store.selectedEdges.keys().next().value].type === "step"}
                        >
                          Step
                        </option>
                      </select>
                    </Show>
                  </div>
                </>
              )}
            </For>
          </div>
        </Show>
      </div>
    </>
  );
};
