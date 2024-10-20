import { batch, createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { EdgeI, InitialEdgeI, InitialNodeI, NodeI, Store } from "../types";
import { Position } from "../types";

export function createNode(node: InitialNodeI): NodeI {
  const type = node?.type || "default";
  return {
    width: type === "dot" ? 12 : type === "note" ? 180 : type === "backdrop" ? 220 : 140,
    height: type === "dot" ? 12 : type === "note" ? 80 : type === "backdrop" ? 110 : 50,
    content: undefined,
    type: "default",
    inputPosition: Position.Top,
    outputPosition: Position.Bottom,
    inputHandle: type === "default",
    outputHandle: type === "default",
    selected: false,
    fontSize: "0.875rem",
    ...node,
    // Todo: input and output should be simplified
    get input(): { x: number; y: number } {
      let x: number;
      let y: number;
      switch (this.inputPosition) {
        case Position.Bottom: {
          x = this.position[0] + this.width / 2;
          y = this.position[1] + this.height;
          break;
        }
        case Position.Right: {
          x = this.position[0] + this.width;
          y = this.position[1] + this.height / 2;
          break;
        }
        case Position.Left: {
          x = this.position[0];
          y = this.position[1] + this.height / 2;
          break;
        }
        default:
          x = this.position[0] + this.width / 2;
          y = this.position[1];
      }
      if (!this.inputHandle) {
        x = this.position[0] + this.width / 2;
        y = this.position[1] + this.height / 2;
      }
      return { x, y };
    },
    get output(): { x: number; y: number } {
      let x: number;
      let y: number;
      switch (this.outputPosition) {
        case Position.Top: {
          x = this.position[0] + this.width / 2;
          y = this.position[1];
          break;
        }
        case Position.Right: {
          x = this.position[0] + this.width;
          y = this.position[1] + this.height / 2;
          break;
        }
        case Position.Left: {
          x = this.position[0];
          y = this.position[1] + this.height / 2;
          break;
        }
        default:
          x = this.position[0] + this.width / 2;
          y = this.position[1] + this.height;
      }
      if (!this.outputHandle) {
        x = this.position[0] + this.width / 2;
        y = this.position[1] + this.height / 2;
      }
      return { x, y };
    },
  };
}

export function createEdge(edge: InitialEdgeI): EdgeI {
  return {
    label: "",
    type: "bezier",
    animated: false,
    arrow: false,
    selected: false,
    style: { stroke: undefined },
    labelStyle: { color: "var(--nodeC)", "background-color": "var(--canvasBG)" },
    ...edge,
  };
}

export const [store, setStore] = createStore<Store>({
  nodes: {},
  edges: {},
  width: "",
  height: "",
  selectedNodes: new Set([]),
  selectedEdges: new Set([]),
  scale: 1,
  transition: [0, 0],
  isDragging: false,
});

export function addNodes(nodes: InitialNodeI[]) {
  batch(() => {
    for (let i = 0; i < nodes.length; i++) {
      setStore("nodes", { [nodes[i].id]: createNode(nodes[i]) });
    }
  });
}

export function addEdges(edges: InitialEdgeI[]) {
  batch(() => {
    for (let i = 0; i < edges.length; i++) {
      setStore("edges", { [edges[i].id]: createEdge(edges[i]) });
    }
  });
}

createEffect(() => {
  setStore(
    "nodes",
    produce((n) => {
      const ids = Object.keys(n);
      for (const id of ids) {
        n[id].selected = false;
      }
      for (const id of store.selectedNodes) {
        n[id].selected = true;
      }
    }),
  );
});
createEffect(() => {
  setStore(
    "edges",
    produce((e) => {
      const ids = Object.keys(e);
      for (const id of ids) {
        e[id].selected = false;
      }
      for (const id of store.selectedEdges) {
        e[id].selected = true;
      }
    }),
  );
});

export const updatePosition = (xTrans: number, yTrans: number, ids: Set<string>) => {
  setStore(
    "nodes",
    produce((n) => {
      for (const id of ids) {
        n[id].position[0] += xTrans / store.scale;
        n[id].position[1] += yTrans / store.scale;
      }
    }),
  );
  // for (const id of ids) {
  //   const p: [number, number] = [xTrans / store.scale, yTrans / store.scale];
  //   setStore("nodes", id, (node) => ({ ...node, position: [node.position[0] + p[0], node.position[1] + p[1]] }));
  // }
};

export const drag = (xTrans: number, yTrans: number, id: string) => {
  setStore(
    "nodes",
    produce((n) => {
      n[id].width += xTrans;
      n[id].height += yTrans;
    }),
  );
};

export const removeSelected = () => {
  const sNodes = store.selectedNodes;
  const sEdges = store.selectedEdges;
  setStore("selectedNodes", new Set([]));
  setStore("selectedEdges", new Set([]));
  setStore(
    "nodes",
    produce((n) => {
      for (const item of sNodes) {
        delete n[item];
      }
    }),
  );
  const keys = Object.keys(store.edges);
  setStore(
    "edges",
    produce((e) => {
      for (let i = 0; i < keys.length; i++) {
        if (sNodes.has(e[keys[i]].source) || sNodes.has(e[keys[i]].target) || sEdges.has(keys[i])) {
          delete e[keys[i]];
        }
      }
    }),
  );
};
