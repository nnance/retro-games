import React from "react";
import { Engine, Bodies } from "matter-js";
import {
  BodyContext,
  useRegisterBody,
  EngineContext,
  useBodyContext,
} from "../framework";

const verticesToPoints = (vertices: Matter.Vector[]): [number, number][] => {
  return vertices.map((vector) => [vector.x, vector.y]);
};

const Box = ({ x, y }: { x: number; y: number }) => {
  React.useContext(BodyContext);
  const box = useRegisterBody(Bodies.rectangle(x, y, 80, 80));

  const points = verticesToPoints(box.current.vertices);
  return (
    <polygon
      stroke="black"
      fill="none"
      strokeWidth="1"
      points={points.toString()}
    />
  );
};

const Ball = ({ x, y, radius }: { x: number; y: number; radius: number }) => {
  React.useContext(BodyContext);
  const ball = useRegisterBody(Bodies.circle(x, y, radius, { restitution: 1 }));

  const { position, circleRadius } = ball.current;

  return <circle cx={position.x} cy={position.y} r={circleRadius} fill="red" />;
};

const Ground = ({ x, y }: { x: number; y: number }) => {
  const ground = useRegisterBody(
    Bodies.rectangle(x, y, 810, 5, { isStatic: true })
  );

  const points = verticesToPoints(ground.current.vertices);

  return (
    <polygon
      stroke="black"
      fill="none"
      strokeWidth="1"
      points={points.toString()}
    />
  );
};

function Board(
  props: React.PropsWithChildren<{ width: number; height: number }>
): React.ReactElement {
  // create an engine
  const engine = React.useContext(EngineContext);
  useBodyContext();

  React.useEffect(() => {
    // run the engine
    Engine.run(engine);
  }, [engine]);

  return (
    <svg width={props.width} height={props.height}>
      {props.children}
    </svg>
  );
}

const GameBodies = (props: React.PropsWithChildren<unknown>) => {
  const bodyState = React.useState<Matter.Body[]>([]);
  return (
    <BodyContext.Provider value={bodyState}>
      {props.children}
    </BodyContext.Provider>
  );
};

export default function BoxesSVG(): React.ReactElement {
  const Height = window.innerHeight - 20;
  const Width = window.innerWidth - 10;

  return (
    <EngineContext.Provider value={Engine.create()}>
      <GameBodies>
        <Board width={Width} height={Height}>
          <Ground x={400} y={600} />
          <Box x={500} y={200} />
          <Box x={550} y={50} />
          <Ball x={580} y={10} radius={20} />
        </Board>
      </GameBodies>
    </EngineContext.Provider>
  );
}
