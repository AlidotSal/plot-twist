import { createMemo } from "solid-js";
import type { EdgeI } from "../../types";
import BaseEdge from "./BaseEdge";
import { store } from "../../store";

interface StraightEdgeProps {
  edge: EdgeI;
}

export default function StraightEdge(props: StraightEdgeProps) {
  const source = store.nodes[props.edge.source];
  const target = store.nodes[props.edge.target];

  const arrowDistance = createMemo(() => {
    let value = 0;
    if (props.edge.arrow && !target.inputHandle) {
      // calculate the distance of the arrow from the edge when there is no input handle
      const dx = target.input.x - source.output.x;
      const dy = target.input.y - source.output.y;
      const corner = (Math.atan2(target.height, target.width) * 180) / Math.PI;
      const atan = Math.atan2(dy, dx);
      const theta = (atan * 180) / Math.PI > 0 ? (atan * 180) / Math.PI : (atan * 180) / Math.PI + 360;

      if ((theta > corner && theta < 180 - corner) || (theta > 180 + corner && theta < 360 - corner)) {
        const x = target.height / (2 * Math.tan((theta / 180) * Math.PI));
        const y = target.height / 2;
        value = Math.sqrt(x * x + y * y);
      } else {
        const x = target.width / 2;
        const y = (target.width / 2) * -Math.tan((theta / 180) * Math.PI);
        value = Math.sqrt(x * x + y * y);
      }
    }
    return value - 3;
  });

  const params = createMemo(() => ({
    sourceX: source?.output.x,
    sourceY: source?.output.y,
    sourcePosition: source?.outputPosition,
    targetX: target?.input.x,
    targetY: target?.input.y,
    targetPosition: target?.inputPosition,
  }));
  const path = () => `M ${params().sourceX},${params().sourceY}L ${params().targetX},${params().targetY}`;
  const baseEdgeProps = createMemo(() => ({
    ...props.edge,
    path: path(),
    sourceNode: source,
    targetNode: target,
  }));
  return <BaseEdge baseEdgeProps={baseEdgeProps()} arrowDistance={arrowDistance()} />;
}
