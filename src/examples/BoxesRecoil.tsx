import React from "react";
import { Engine, Bodies } from "matter-js";
import { useRecoilValue, RecoilRoot } from "recoil";
import {
  useRegisterBody,
  bodySelector,
  engineState,
  useBodyContext,
} from "../framework";

const Box = ({ x, y }: { x: number; y: number }) => {
  const bodyRef = useRegisterBody(Bodies.rectangle(x, y, 80, 80));
  const body = useRecoilValue(bodySelector(bodyRef.current.id));

  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Ball = ({ x, y, radius }: { x: number; y: number; radius: number }) => {
  const bodyRef = useRegisterBody(
    Bodies.circle(x, y, radius, { restitution: 1 })
  );

  const body = useRecoilValue(bodySelector(bodyRef.current.id));

  return (
    <circle
      cx={body?.position?.x}
      cy={body?.position?.y}
      r={radius}
      stroke="grey"
    />
  );
};

const Ground = ({ x, y }: { x: number; y: number }) => {
  const bodyRef = useRegisterBody(
    Bodies.rectangle(x, y, 810, 5, { isStatic: true })
  );

  const body = useRecoilValue(bodySelector(bodyRef.current.id));

  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

function Board(
  props: React.PropsWithChildren<{ width: number; height: number }>
): React.ReactElement {
  const engine = useRecoilValue(engineState);
  useBodyContext();

  React.useEffect(() => {
    // run the engine
    Engine.run(engine);
  }, [engine]);

  return (
    <svg
      width={props.width}
      height={props.height}
      style={{ backgroundColor: "black" }}
    >
      {props.children}
    </svg>
  );
}

export default function BoxesRecoil(): React.ReactElement {
  return (
    <RecoilRoot>
      <Board width={800} height={600}>
        <Ground x={400} y={600} />
        <Box x={500} y={200} />
        <Box x={550} y={50} />
        <Ball x={580} y={10} radius={20} />
      </Board>
    </RecoilRoot>
  );
}