import React from "react";
import { Engine, World, Bodies, Events, Composite } from "matter-js";

const EngineContext = React.createContext(Engine.create());

const Box = ({ x, y }: { x: number; y: number }) => {
  const engine = React.useContext(EngineContext);
  const [box] = React.useState(Bodies.rectangle(x, y, 80, 80));

  React.useEffect(() => {
    World.add(engine.world, box);
  }, [box, engine.world]);

  return null;
};

const Ball = ({ x, y, radius }: { x: number; y: number, radius: number }) => {
  const engine = React.useContext(EngineContext);
  const [ball, setBall] = React.useState({id: 0, x, y, radius});

  React.useEffect(() => {
    const body = Bodies.circle(x, y, radius, { restitution: 1 });
    setBall(ball => ({...ball, id: body.id}));
    World.add(engine.world, body);
  }, [engine.world, radius, x, y]);

  React.useEffect(() => {
    const afterUpdate = () => {
      const body = Composite.allBodies(engine.world).find(body => body.id === ball.id);
      if (body) setBall({...ball, x: body.position.x, y: body.position.y})
    };
  
    Events.on(engine, "afterUpdate", afterUpdate);
    return () => Events.off(engine, "afterUpdate", afterUpdate);
  }, [ball, engine]);

  return (
    <circle
      cx={ball.x}
      cy={ball.y}
      r={ball.radius}
      fill="red"
    />
  );
};

const Ground = ({ x, y }: { x: number; y: number }) => {
  const engine = React.useContext(EngineContext);
  const [ground] = React.useState(
    Bodies.rectangle(x, y, 810, 5, { isStatic: true })
  );

  React.useEffect(() => {
    World.add(engine.world, ground);
  }, [ground, engine.world]);

  const points = [
    [x - 405, y],
    [x - 405, y + 5],
    [x + 405, y + 5],
    [x + 405, y],
  ];

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

export default function PaddleSVG(): React.ReactElement {
  const Height = window.innerHeight - 20;
  const Width = window.innerWidth - 10;

  return (
    <EngineContext.Provider value={Engine.create()}>
      <Board width={Width} height={Height}>
        <Ground x={400} y={600} />
        {/* <Box x={500} y={200} />
        <Box x={550} y={50} /> */}
        <Ball x={580} y={10} radius={20} />
      </Board>
    </EngineContext.Provider>
  );
}
