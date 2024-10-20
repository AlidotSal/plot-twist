import { Match, Switch } from "solid-js";
import Bezier from "./BezierEdge";
import SmoothStep from "./SmoothStepEdge";
import Step from "./StepEdge";
import Straight from "./StraightEdge";

import type { EdgeI } from "../../types";

interface NodeProps {
  edge: EdgeI;
}

export default (props: NodeProps) => {
  return (
    <Switch fallback={<Bezier edge={props.edge} />}>
      <Match when={props.edge.type === "straight"}>
        <Straight edge={props.edge} />
      </Match>
      <Match when={props.edge.type === "smoothStep"}>
        <SmoothStep edge={props.edge} />
      </Match>
      <Match when={props.edge.type === "step"}>
        <Step edge={props.edge} />
      </Match>
    </Switch>
  );
};
