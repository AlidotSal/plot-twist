import type { JSX } from "solid-js";
import type { Position } from "./utils";

export interface InitialNodeI {
  id: string;
  position: [number, number];
  content?: string;
  type?: string;
  inputPosition?: Position;
  outputPosition?: Position;
  width?: number;
  height?: number;
  inputHandle?: boolean;
  outputHandle?: boolean;
  bgColor?: string;
  fontSize?: string;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
}
export interface NodeI {
  id: string;
  content: undefined | string;
  type: string;
  position: [number, number];
  inputPosition: Position;
  outputPosition: Position;
  width: number;
  height: number;
  inputHandle: boolean;
  outputHandle: boolean;
  bgColor?: string;
  fontSize: string;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
  input: { x: number, y: number };
  output: { x: number, y: number };
  selected: boolean;
}

export interface InitialEdgeI {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
  arrow?: boolean;
  style?: JSX.PathSVGAttributes<SVGPathElement>;
  labelStyle?: JSX.CSSProperties;
}

export interface EdgeI {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  animated: boolean;
  arrow: boolean;
  selected: boolean;
  style: JSX.PathSVGAttributes<SVGPathElement>;
  labelStyle: JSX.CSSProperties;
}

export interface StoreProps {
  nodes: InitialNodeI[];
  edges: EdgeI[];
  width?: string;
  height?: string;
  background?: string;
  children: JSX.Element;
}

export interface GraphProps {
  nodes: NodeI[];
  edges: EdgeI[];
  width?: string;
  height?: string;
  scale?: number;
  transition?: [number, number]
}

export interface EdgeProps extends EdgeI {
  path: string;
}

export interface Nodes {
  [key: string]: NodeI;
}
export interface Edges {
  [key: string]: EdgeI;
}
export interface Store {
  nodes: Nodes;
  edges: Edges;
  width: string;
  height: string;
  selectedNodes:Set<string>;
  selectedEdges: Set<string>;
  scale: number;
  transition: [number, number]
  isDragging: boolean;
}

export type HandleType = "source" | "target";

export type KeyCode = string | string[];
