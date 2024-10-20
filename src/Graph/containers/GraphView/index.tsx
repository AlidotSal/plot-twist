import { For, createEffect, onCleanup, onMount } from "solid-js";
import { css } from "solid-styled";
import Edge from "../../components/Edges";
import Node from "../../components/Nodes";
import { createNode, drag, removeSelected, setStore, store, updatePosition } from "../../store";

export default function GraphView() {
  let containerRef!: HTMLDivElement;
  let canvasRef!: HTMLCanvasElement;
  let edgesRef!: SVGGElement;
  let nodesRef!: HTMLDivElement;

  let sx = 0;
  let sy = 0;
  let isDrawing = false;
  let isDark = false;

  function handleKeyPress(e: KeyboardEvent) {
    const target = e?.target as HTMLElement;
    const isCanvas = target.nodeName !== "INPUT" && target.nodeName !== "TEXTAREA";
    if (isCanvas && e.code === "KeyF") {
      setStore("transition", [0, 0]);
      setStore("scale", 1);
      return;
    }
    if (isCanvas && e.code === "KeyN") {
      const id = window.crypto.randomUUID();
      const newNode = createNode({
        id,
        position: [sx - 70 - store.transition[0], (sy - 25 - store.transition[1]) / store.scale],
        content: "New Node!",
      });
      setStore("nodes", { [id]: newNode });
      return;
    }
    if (isCanvas && e.code === "KeyS") {
      const id = window.crypto.randomUUID();
      const newNode = createNode({
        id,
        position: [sx - 100 - store.transition[0], sy - 50 - store.transition[1]],
        content: "Sticky Note!",
        type: "note",
      });
      setStore("nodes", { [id]: newNode });
      return;
    }
    if (isCanvas && e.code === "Period") {
      const id = window.crypto.randomUUID();
      const newNode = createNode({
        id,
        position: [sx - 6 - store.transition[0], sy - 6 - store.transition[1]],
        type: "dot",
      });
      setStore("nodes", { [id]: newNode });
      return;
    }
    if (isCanvas && e.code === "KeyB") {
      const id = window.crypto.randomUUID();
      const newNode = createNode({
        id,
        position: [sx - (110 + store.transition[0]), sy - (65 + store.transition[1])],
        content: "Group",
        type: "backdrop",
      });
      setStore("nodes", { [id]: newNode });
      return;
    }
    if (isCanvas && e.code === "KeyE") {
      isDrawing = true;
      return;
    }
    if (isCanvas && e.code === "Delete") {
      removeSelected();
    }
  }

  const handlePointerDown = (event: PointerEvent) => {
    sx = event.x;
    sy = event.y;
    isDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
    const transX = store.transition[0];
    const transY = store.transition[1];
    let lx = Math.max(sx - 150 - transX, 0);
    let rx = sx + 150 - transX;
    let ty = Math.max(sy - 150 - transY, 0);
    let by = sy + 150 - transY;
    let isSelecting = false;
    setStore("isDragging", false);
    const element = event.target as HTMLElement;
    if (element.tagName === "svg") {
      setStore("selectedNodes", (p) => (p.size === 0 ? p : new Set([])));
      setStore("selectedEdges", (p) => (p.size === 0 ? p : new Set([])));
    }
    const ctx = canvasRef.getContext("2d") as CanvasRenderingContext2D;
    containerRef.setPointerCapture(event.pointerId);
    containerRef.onpointermove = (event: PointerEvent) => {
      if (event.altKey) {
        setStore("transition", (t) => [t[0] + event.movementX, t[1] + event.movementY]);
        return;
      }
      if (store.isDragging) {
        drag(event.movementX, event.movementY, store.selectedNodes.keys().next().value ?? "");
        return;
      }
      if (store.selectedNodes.size > 0 && !isSelecting && !isDrawing) {
        updatePosition(event.movementX, event.movementY, store.selectedNodes);
        return;
      }
      if (isDrawing) {
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(event.x, event.y);
        ctx.strokeStyle = "rgba(222, 156, 0, 1)";
        ctx.stroke();
        ctx.closePath();
        return;
      }
      isSelecting = true;
      let nearNodes = Object.keys(store.nodes).filter(
        (id) =>
          store.nodes[id].position[0] + transX > lx &&
          store.nodes[id].position[0] + transX + store.nodes[id].width < rx &&
          store.nodes[id].position[1] + transY > ty &&
          store.nodes[id].position[1] + transY + store.nodes[id].height < by,
      );
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      ctx.beginPath();
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 126, 138, 0.1)";
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 63, 69, 0.85)";
      ctx.rect(sx, sy, event.x - sx, event.y - sy);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      if (event.x - transX > rx) {
        rx += 150;
        nearNodes = Object.keys(store.nodes).filter(
          (id) =>
            store.nodes[id].position[0] + transX > lx &&
            store.nodes[id].position[0] + transX + store.nodes[id].width < rx &&
            store.nodes[id].position[1] + transY > ty &&
            store.nodes[id].position[1] + transY + store.nodes[id].height < by,
        );
      }
      if (event.x - transX < lx) {
        lx -= 150;
        nearNodes = Object.keys(store.nodes).filter(
          (id) =>
            store.nodes[id].position[0] + transX > lx &&
            store.nodes[id].position[0] + transX + store.nodes[id].width < rx &&
            store.nodes[id].position[1] + transY > ty &&
            store.nodes[id].position[1] + transY + store.nodes[id].height < by,
        );
      }
      if (event.y - transY > by) {
        by += 150;
        nearNodes = Object.keys(store.nodes).filter(
          (id) =>
            store.nodes[id].position[0] + transX > lx &&
            store.nodes[id].position[0] + transX + store.nodes[id].width < rx &&
            store.nodes[id].position[1] + transY > ty &&
            store.nodes[id].position[1] + transY + store.nodes[id].height < by,
        );
      }
      if (event.y - transY < ty) {
        ty -= 150;
        nearNodes = Object.keys(store.nodes).filter(
          (id) =>
            store.nodes[id].position[0] + transX > lx &&
            store.nodes[id].position[0] + transX + store.nodes[id].width < rx &&
            store.nodes[id].position[1] + transY > ty &&
            store.nodes[id].position[1] + transY + store.nodes[id].height < by,
        );
      }
      const selected: string[] = [];
      const maxX = Math.max(sx, event.x);
      const minX = Math.min(sx, event.x);
      const maxY = Math.max(sy, event.y);
      const minY = Math.min(sy, event.y);
      for (const id of nearNodes) {
        const elementRect = document.getElementById(id)?.getBoundingClientRect();
        if (
          elementRect &&
          elementRect.right < maxX &&
          elementRect.left > minX &&
          elementRect.bottom < maxY &&
          elementRect.top > minY
        ) {
          selected.push(id);
        }
      }
      setStore("selectedNodes", (p) => {
        if (p.size === selected.length) return p;
        return new Set(selected);
      });
    };
    containerRef.onpointerup = (event: PointerEvent) => {
      isSelecting = false;
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      if (isDrawing && store.selectedNodes.size > 0) {
        for (const node of Object.values(store.nodes)) {
          const elementRect = document.getElementById(node.id)?.getBoundingClientRect();
          if (
            elementRect &&
            elementRect.left < event.x &&
            elementRect.right > event.x &&
            elementRect.bottom > event.y &&
            elementRect.top < event.y &&
            node.id !== store.selectedNodes.keys().next().value
          ) {
            const id = Date.now().toString();
            setStore("edges", {
              [id]: {
                id,
                label: "",
                type: "bezier",
                animated: false,
                arrow: false,
                source: store.selectedNodes.keys().next().value ?? "",
                target: node.id,
                selected: false,
                style: { stroke: "var(--edgeC)" },
                labelStyle: { color: "var(--nodeC)", "background-color": "var(--canvasBG)" },
              },
            });
          }
        }
      }
      isDrawing = false;
      containerRef.onpointermove = null;
      containerRef.onpointerup = null;
    };
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.altKey) setStore("scale", (s) => Math.max(Math.min(s - e.deltaY / 600, 4), 0.25));
  };

  createEffect(() => {
    nodesRef.animate([{ translate: `${store.transition[0]}px ${store.transition[1]}px` }], {
      duration: 0,
      fill: "both",
    });
    edgesRef.animate([{ translate: `${store.transition[0]}px ${store.transition[1]}px` }], {
      duration: 0,
      fill: "both",
    });
    const rects = document.getElementById("rects")?.firstChild && document.getElementById("rects")?.children[0];
    rects?.animate([{ translate: `${store.transition[0]}px ${store.transition[1]}px` }], { duration: 0, fill: "both" });
  });
  createEffect(() => {
    nodesRef.animate([{ scale: `${store.scale}` }], { duration: 0, fill: "both" });
    edgesRef.animate([{ scale: `${store.scale}` }], { duration: 0, fill: "both" });
    const rects = document.getElementById("rects")?.firstChild && document.getElementById("rects")?.children[0];
    rects?.animate([{ scale: `${store.scale}` }], { duration: 0, fill: "both" });
  });

  onMount(() => {
    containerRef.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyPress);
    containerRef.addEventListener("wheel", handleWheel);
  });
  onCleanup(() => {
    containerRef.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("keydown", handleKeyPress);
    containerRef.removeEventListener("wheel", handleWheel);
  });

  css`
    .container {
      width: ${store.width};
      height: ${store.height};
    }
    .edges {
      width: ${store.width};
      height: ${store.height};
    }
  `;

  return (
    <div ref={containerRef} class="odysea container">
      <svg id="rects" />
      <svg class="svg">
        <title>All the nodes and edges in the graph are here!</title>
        <g ref={edgesRef} class="edges">
          <For each={Object.values(store.edges)}>{(edge) => (edge ? <Edge edge={edge} /> : null)}</For>
        </g>
      </svg>
      <div ref={nodesRef} class="nodes">
        <For each={Object.values(store.nodes)}>{(node) => (node ? <Node node={node} /> : null)}</For>
      </div>
      <canvas
        ref={canvasRef}
        width={getComputedStyle(containerRef).getPropertyValue("width")}
        height={getComputedStyle(containerRef).getPropertyValue("height")}
      />
    </div>
  );
}
