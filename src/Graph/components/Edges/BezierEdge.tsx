import {} from "solid-js";
import { Position } from "../../types";
import type { EdgeI } from "../../types";
import BaseEdge from "./BaseEdge";
import { store } from "../../store";

// how to create a smooth, controlled beizer edge from source and target positions
// referenced from ReactFlow.dev
interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  targetWidth: number;
  targetHeight: number;
  inputX: number;
  inputY: number;
  outputX: number;
  outputY: number;
  hasArrow: boolean;
  hasInputHandle: boolean;
}

interface GetControlParams {
  pos?: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number?, number?] {
  let ctX: number | undefined = undefined;
  let ctY: number | undefined = undefined;
  switch (pos) {
    case Position.Left:
    case Position.Right: {
      ctX = 0.5 * (x1 + x2);
      ctY = y1;
      break;
    }
    case Position.Top:
    case Position.Bottom: {
      ctX = x1;
      ctY = 0.5 * (y1 + y2);
      break;
    }
  }
  return [ctX, ctY];
}

function getSimpleBezierPath(params: GetSimpleBezierPathParams): string {
  let x = 0;
  let y = 0;
  if (params.hasArrow && !params.hasInputHandle) {
    // calculate the distance of the arrow from the edge when there is no input handle
    const dx = params.outputX - params.inputX;
    const dy = params.outputY - params.inputY;
    const atan = Math.atan2(dy, dx);
    const corner = (Math.atan2(params.targetHeight, params.targetWidth) * 180) / Math.PI;
    const theta = atan > 0 ? 360 - (atan / Math.PI) * 180 : (-atan / Math.PI) * 180;

    if ((theta > corner && theta < 180 - corner) || (theta > 180 + corner && theta < 360 - corner)) {
      x = (params.targetWidth / 2) * Math.cos((theta / 180) * Math.PI);
      y = theta + corner > 180 ? params.targetHeight / 2 : -params.targetHeight / 2;
    } else {
      x = theta + corner < 180 || theta + corner > 360 ? params.targetWidth / 2 : -params.targetWidth / 2;
      y = -(params.targetHeight / 2) * Math.sin((theta / 180) * Math.PI);
    }
  }
  const [sourceControlX, sourceControlY] = getControl({
    pos: params.sourcePosition,
    x1: params.sourceX,
    y1: params.sourceY,
    x2: params.targetX + x,
    y2: params.targetY + y,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: params.targetPosition,
    x1: params.targetX + x,
    y1: params.targetY + y,
    x2: params.sourceX,
    y2: params.sourceY,
  });
  return `M${Math.round(params.sourceX)},${Math.round(params.sourceY)} C${Math.round(sourceControlX ?? 0)},${Math.round(sourceControlY ?? 0)} ${Math.round(targetControlX ?? 0)},${Math.round(targetControlY ?? 0)} ${Math.round(params.targetX + x)},${Math.round(params.targetY + y)}`;
}

interface BezierProps {
  edge: EdgeI;
}

export default function BezierEdge(props: BezierProps) {
  const source = store.nodes[props.edge.source];
  const target = store.nodes[props.edge.target];

  const params = () => {
    const sourceX = source?.output.x;
    const sourceY = source?.output.y;
    const sourcePosition = source?.outputPosition;
    const targetX = target?.input.x;
    const targetY = target?.input.y;
    const targetPosition = target?.inputPosition;
    const targetWidth = target.width;
    const targetHeight = target.height;
    const inputX = target.input.x;
    const inputY = target.input.y;
    const outputX = source.output.x;
    const outputY = source.output.y;
    return {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      targetWidth,
      targetHeight,
      inputX,
      inputY,
      outputX,
      outputY,
      hasArrow: props.edge.arrow,
      hasInputHandle: target.inputHandle,
    };
  };
  const path = () => getSimpleBezierPath(params());
  const baseEdgeProps = () => ({
    ...props.edge,
    path: path(),
  });

  return <BaseEdge baseEdgeProps={baseEdgeProps()} arrowDistance={0} />;
}
