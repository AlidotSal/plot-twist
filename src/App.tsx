// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import type { Component } from "solid-js";
import Flow from "./Graph/index.ts";
import { StoreProvider } from "./Graph/store/index.tsx";
import logo from "./assets/logo.svg";
import { Export } from "./components/Export";
import Sidebar from "./components/SideBar/Sidebar.tsx";

const App: Component = () => {
  function createNodesAndEdges(xNodes = 10, yNodes = 10) {
    const nodes = [];
    const edges = [];
    let nodeId = 1;
    let recentNodeId = null;

    for (let y = 0; y < yNodes; y++) {
      for (let x = 0; x < xNodes; x++) {
        const position = [x * 100, y * 60];
        const node = {
          id: `stress-${nodeId.toString()}`,
          width: 50,
          height: 50,
          content: `Node ${nodeId}`,
          position,
        };
        nodes.push(node);

        if (recentNodeId && nodeId <= xNodes * yNodes) {
          edges.push({
            id: `${x}-${y}`,
            source: `stress-${recentNodeId.toString()}`,
            target: `stress-${nodeId.toString()}`,
          });
        }

        recentNodeId = nodeId;
        nodeId++;
      }
    }

    return { nodes, edges };
  }
  const { nodes, edges } = createNodesAndEdges(100, 100);

  const initialNodes = [
    {
      id: "1",
      position: [425, 60],
      content: "Base Node",
      width: 100,
      height: 100,
      inputHandle: false,
    },
    {
      id: "14",
      position: [550, 200],
      content: "Dot!",
      type: "dot",
      outputHandle: false,
    },
    {
      id: "2",
      position: [690, 300],
      content: "Mixed Anchors",
    },
    {
      id: "3",
      position: [425, 490],
      content: "Output Node",
      width: 100,
      height: 40,
      bgColor: "#FFE4E6",
      textColor: "#000000",
      inputHandle: false,
    },
    {
      id: "4",
      position: [240, 270],
      content: "Drag me!",
      width: 125,
      height: 40,
      inputHandle: false,
      outputHandle: false,
    },
    {
      id: "5",
      position: [860, 860],
      content: "Custom Node",
      width: 125,
      height: 40,
      bgColor: "#C8FFC7",
      textColor: "#000000",
      borderColor: "rgb(0 0 0 / 10%)",
      borderRadius: 0,
      inputHandle: true,
      outputHandle: false,
    },
    {
      id: "6",
      position: [320, 650],
      content: "Important Node",
      width: 80,
      height: 80,
      borderColor: "#ffffff",
      borderRadius: 30,
      bgColor: "#FF4121",
      inputPosition: "right",
      outputHandle: false,
    },
    {
      id: "7",
      position: [280, 410],
      width: 300,
      height: 350,
      content: "group of nodes",
      type: "backdrop",
      bgColor: "#858885",
    },
    {
      id: "8",
      position: [1050, 40],
      width: 350,
      height: 515,
      content: `<h3 style="margin-bottom: 1.5em">Guide:</h3>
        <ul style="padding-inline-start: 1em">
        <li style="margin-block: .65em">Click and drag nodes and the connected edges will change accordingly.</li>
        <li style="margin-block: .65em">Select nodes and edges by clicking on them.</li>
        <li style="margin-block: .65em">Change selected nodes and edges properties in the side pannel.</li>
        </ul>
        <h3 style="margin-top: 2em">Keboard shortcuts:</h3>
        <p style="margin-left: 1em"><em style="font-weight: 500">N:</em> create new node</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">S:</em> create new sticky note node</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">Period(.):</em> create new dot node</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">B:</em> create new group node</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">E:</em> Enter edge creation mode</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">Alt + drag:</em> move around the canvas</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">Alt + scroll:</em> zoom in and out</p>
        <p style="margin-left: 1em"><em style="font-weight: 500">Delete:</em> remove selected nodes and edges</p>
        <svg style="position: absolute; top: .2em; right: 1em" width="40px" height="46px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 155.3">
          <defs>
            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/>
              <stop offset=".3" stop-color="#dcf2fd"/>
              <stop offset="1" stop-color="#76b3e1"/>
            </linearGradient>
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2">
              <stop offset="0" stop-color="#76b3e1"/>
              <stop offset=".5" stop-color="#4377bb"/>
              <stop offset="1" stop-color="#1f3b77"/>
            </linearGradient>
            <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="18.4" y1="64.2" x2="144.3" y2="149.8">
              <stop offset="0" stop-color="#315aa9"/>
              <stop offset=".5" stop-color="#518ac8"/>
              <stop offset="1" stop-color="#315aa9"/>
            </linearGradient><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="75.2" y1="74.5" x2="24.4" y2="260.8">
              <stop offset="0" stop-color="#4377bb"/>
              <stop offset=".5" stop-color="#1a336b"/>
              <stop offset="1" stop-color="#1a336b"/>
            </linearGradient>
          </defs>
          <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="#76b3e1"/>
          <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" opacity=".3" fill="url(#a)"/>
          <path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" fill="#518ac8"/>
          <path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" opacity=".3" fill="url(#b)"/>
          <path d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z" fill="url(#c)"/>
          <path d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z" fill="url(#d)"/>
        </svg>`,
      fontSize: "16px",
      type: "note",
    },
  ];

  const initialEdges = [
    { id: "e1-14", source: "1", target: "14", label: "" },
    {
      id: "e14-2",
      source: "14",
      target: "2",
      label: "edge label",
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      label: "animated edges",
      style: { stroke: "#ff4422" },
      animated: true,
    },
    {
      id: "e14-4",
      source: "14",
      target: "4",
      arrow: true,
      type: "straight",
    },
    {
      id: "e2-5",
      source: "2",
      target: "5",
      label: "colored edges",
      arrow: true,
      style: { stroke: "#5592e3" },
    },
    {
      id: "e3-6",
      source: "3",
      target: "6",
      label: "colored label",
      type: "smoothStep",
      labelStyle: { color: "white", "background-color": "#FF4561" },
    },
  ];

  const handlePointerDown = (event: PointerEvent) => {
    if (event.target.className !== "split") return;
    event.preventDefault();
    document.documentElement.onpointermove = (event: PointerEvent) => {
      const width = getComputedStyle(document.documentElement).getPropertyValue("--sideW");
      const newWidth = Math.min(Math.max(300, width - event.movementX), 650);
      document.documentElement.style.setProperty("--sideW", newWidth);
    };
    document.documentElement.onpointerup = (event: PointerEvent) => {
      document.documentElement.onpointermove = null;
      document.documentElement.onpointerup = null;
    };
  };

  onMount(() => {
    document.documentElement.addEventListener("pointerdown", handlePointerDown);
  });
  onCleanup(() => {
    document.documentElement.removeEventListener("pointerdown", handlePointerDown);
  });

  return (
    <>
      <Flow nodes={initialNodes} edges={initialEdges} />
      <span class="split" />
      <div class="side">
        <Sidebar />
        <Export />
      </div>
    </>
  );
};

export default App;
