import React from "react";
import { Engine, Render, World, Bodies } from "matter-js";

const Context = React.createContext(Engine.create());

const Box = ({ x, y }: { x: number; y: number }) => {
  const engine = React.useContext(Context);
  const [box] = React.useState(Bodies.rectangle(x, y, 80, 80));

  React.useEffect(() => {
      World.add(engine.world, box);
  }, [box, engine.world]);

  return null;
};

const Ball = ({ x, y }: { x: number; y: number }) => {
  const engine = React.useContext(Context);
  const [ball] = React.useState(Bodies.circle(x, y, 20, { restitution: 1 }));

  React.useEffect(() => {
      World.add(engine.world, ball);
  }, [ball, engine.world]);

  return null;
};

const Ground = ({ x, y }: { x: number; y: number }) => {
    const engine = React.useContext(Context);
    const [ground] = React.useState(Bodies.rectangle(x, y, 810, 5, { isStatic: true }));
  
    React.useEffect(() => {
        World.add(engine.world, ground);
    }, [ground, engine.world]);
  
    return null;
  };
  
  
function Board(props: React.PropsWithChildren<unknown>): React.ReactElement {
  const divRef = React.useRef<HTMLDivElement>(null);

  // create an engine
  const engine = React.useContext(Context);

  React.useEffect(() => {
    // create a renderer
    const render = Render.create({
      element: divRef.current || undefined,
      engine: engine,
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
  }, [divRef, engine]);

  return <div ref={divRef}>{props.children}</div>;
}

export default function MatterContext(): React.ReactElement {
  return (
    <Context.Provider value={Engine.create()}>
      <Board>
        <Ground x={400} y={600} />
        <Box x={500} y={200} />
        <Box x={550} y={50} />
        <Ball x={580} y={10} />
      </Board>
    </Context.Provider>
  );
}
