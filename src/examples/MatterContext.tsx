import React from "react";
import { Engine, Render, Bodies } from "matter-js";
import { useRegisterBody, EngineContext } from "../framework";

const Box = ({ x, y }: { x: number; y: number }) => {
  useRegisterBody(Bodies.rectangle(x, y, 80, 80));
  return null;
};

const Ball = ({ x, y }: { x: number; y: number }) => {
  useRegisterBody(Bodies.circle(x, y, 20, { restitution: 1 }));
  return null;
};

const Ground = ({ x, y }: { x: number; y: number }) => {
  useRegisterBody(Bodies.rectangle(x, y, 810, 5, { isStatic: true }));
  return null;
};

function Board(props: React.PropsWithChildren<unknown>): React.ReactElement {
  const divRef = React.useRef<HTMLDivElement>(null);

  // create an engine
  const engine = React.useContext(EngineContext);

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
    <EngineContext.Provider value={Engine.create()}>
      <Board>
        <Ground x={400} y={600} />
        <Box x={500} y={200} />
        <Box x={550} y={50} />
        <Ball x={580} y={10} />
      </Board>
    </EngineContext.Provider>
  );
}
