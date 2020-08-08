import React from "react";
import Matter from "matter-js";

export default function Boxes(): React.ReactElement {
  const divRef = React.useRef<HTMLDivElement>(null);

  // module aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create an engine
  const engine = Engine.create();

  // create two boxes and a ground
  const boxA = Bodies.rectangle(500, 200, 80, 80);
  const boxB = Bodies.rectangle(550, 50, 80, 80);
  const ball = Bodies.circle(580,10,20, {restitution: 1});
  const rightWall = Bodies.rectangle(800, 0, 5, 1200, { isStatic: true });
  const ground = Bodies.rectangle(400, 600, 810, 5, { isStatic: true });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground, ball, rightWall]);

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
  }, [divRef, Engine, Render, engine]);

  return <div ref={divRef} />;
}
