import type { EdgeI } from "../../types";
import SmoothStepEdge from "./SmoothStepEdge";

interface SimpleBezierProps {
  edge: EdgeI;
}

export default (props: SimpleBezierProps) => {
  return <SmoothStepEdge {...props} borderRadius={0} />;
};
