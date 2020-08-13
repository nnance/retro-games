import React from "react";
import { Engine, World, Bodies, Events, Composite } from "matter-js";

const EngineContext = React.createContext(Engine.create());
const BodyContext = React.createContext<
  [Matter.Body[], React.Dispatch<React.SetStateAction<Matter.Body[]>>]
>([[], () => undefined]);

const useBodyContext = () => {
  const engine = React.useContext(EngineContext);
  const [, setBodies] = React.useContext(BodyContext);

  React.useEffect(() => {
    const afterUpdate = () => {
      setBodies(Composite.allBodies(engine.world));
    };

    Events.on(engine, "afterUpdate", afterUpdate);
    return () => Events.off(engine, "afterUpdate", afterUpdate);
  }, [engine, setBodies]);
};

const useRegisterBody = (body: React.MutableRefObject<Matter.Body>) => {
  const engine = React.useContext(EngineContext);

  React.useEffect(() => {
    World.add(engine.world, body.current);
  }, [body, engine.world]);
}

const verticesToPoints = (vertices: Matter.Vector[]): [number, number][] => {
  return vertices.map((vector) => [vector.x, vector.y]);
};

const Box = ({ x, y }: { x: number; y: number }) => {
  React.useContext(BodyContext);

  const box = React.useRef(Bodies.rectangle(x, y, 80, 80));
  useRegisterBody(box);

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
  const ball = React.useRef(Bodies.circle(x, y, radius, { restitution: 1 }));
  useRegisterBody(ball);

  const { position, circleRadius } = ball.current;

  return <circle cx={position.x} cy={position.y} r={circleRadius} fill="red" />;
};

const Ground = ({ x, y }: { x: number; y: number }) => {
  const ground = React.useRef(
    Bodies.rectangle(x, y, 810, 5, { isStatic: true })
  );
  useRegisterBody(ground);

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

export default function PaddleSVG(): React.ReactElement {
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
