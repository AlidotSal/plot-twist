import { createSignal } from "solid-js";
import fastJson from "fast-json-stringify";
import { addEdges, addNodes, setStore, store } from "../../Graph/store";
import type { Edges, Nodes } from "../../Graph";

const stringify = fastJson({
  title: "store",
  type: "object",
  properties: {
    nodes: {
      type: "object",
      patternProperties: {
        ".*$": {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string" },
            type: { type: "string" },
            position: { type: "array" },
            inputPosition: { type: "string" },
            outputPosition: { type: "string" },
            width: { type: "integer" },
            height: { type: "integer" },
            inputHandle: { type: "boolean" },
            outputHandle: { type: "boolean" },
            bgColor: { type: "string" },
            fontSize: { type: "string" },
            borderColor: { type: "string" },
            borderRadius: { type: "integer" },
            textColor: { type: "string" },
            input: {
              type: "object",
              properties: {
                x: { type: "integer" },
                y: { type: "integer" },
              },
            },
            output: {
              type: "object",
              properties: {
                x: { type: "integer" },
                y: { type: "integer" },
              },
            },
            selected: { type: "boolean" },
          },
        },
      },
    },
    edges: {
      type: "object",
      patternProperties: {
        ".*$": {
          type: "object",
          properties: {
            id: { type: "string" },
            source: { type: "string" },
            target: { type: "string" },
            label: { type: "string" },
            type: { type: "string" },
            animated: { type: "boolean" },
            arrow: { type: "boolean" },
            selected: { type: "boolean" },
            style: {
              type: "object",
              properties: {
                stroke: { type: "string" },
              },
            },
            labelStyle: {
              type: "object",
              properties: {
                color: { type: "string" },
                "background-color": { type: "string" },
              },
            },
          },
        },
      },
    },
  },
});

export function Export() {
  const [copied, setCopied] = createSignal(false);
  const [loaded, setLoaded] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  function updateClipboard() {
    navigator.clipboard
      .writeText(
        `<Flow nodes={${JSON.stringify(Object.values(store.nodes))}} edges={${JSON.stringify(Object.values(store.edges))}} width={"${store.width}"} height={"${store.height}"} transition={[${store.transition}]} scale={${store.scale}} />`,
      )
      .then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        },
        () => {
          setCopied(false);
        },
      );
  }

  function clearStore() {
    setStore("selectedNodes", new Set([]));
    setStore("selectedEdges", new Set([]));
    setStore((p) => ({ ...p, nodes: {}, edges: {} }));
  }

  function save() {
    localStorage.setItem("graphStore", stringify({ nodes: store.nodes, edges: store.edges }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  function load() {
    const saved: { nodes: Nodes; edges: Edges } = JSON.parse(localStorage.getItem("graphStore") ?? "");
    setStore((p) => ({ ...p, nodes: {}, edges: {} }));
    addNodes(Object.values(saved.nodes));
    addEdges(Object.values(saved.edges));
    setLoaded(true);
    setTimeout(() => setLoaded(false), 1200);
  }

  return (
    <div class="export">
      <button type="button" onPointerDown={updateClipboard}>
        {copied() ? "copied! 🍻" : "copy"}
      </button>
      <button type="button" onPointerDown={save}>
        {saved() ? "saved! 🍻" : "save"}
      </button>
      <button type="button" onPointerDown={load}>
        {loaded() ? "loaded! 🍻" : "load"}
      </button>
      <button type="button" onPointerDown={clearStore}>
        clear
      </button>
    </div>
  );
}
