import React from "react";
import { Engine, Bodies, World, Render, Body } from "matter-js";
import { useGameControls } from "../framework/controller";

const offset = 10;
const brickSize = { width: 60, height: 20 };

const buildGrid = (rows: number, cols: number): Matter.Body[] => {
  const buildRow = (row: number) =>
    Array.from(Array(cols), (_, idx) => {
      const { width, height } = brickSize;
      return Bodies.rectangle(
        200 + width * idx,
        150 + row * height,
        width,
        height,
        {
          isStatic: true,
        }
      );
    });

  const buildRows = (count: number) =>
    Array.from(Array(count), (_, idx) => buildRow(idx)).flat();

  return buildRows(rows);
};

export default function Boxes(): React.ReactElement {
  const divRef = React.useRef<HTMLDivElement>(null);
  const bodiesRef = React.useRef({
    ball: Bodies.circle(400, 200, 10, {
      inertia: Infinity,
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      force: { x: 0.003, y: 0.003 },
    }),
    paddle: Bodies.rectangle(450, 500, 80, 20, {isStatic: true}),
    grid: buildGrid(2, 7)
  });
  
  React.useEffect(() => {
    // create an engine
    const engine = Engine.create();
  
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
  
    const ceiling = Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, {
      isStatic: true,
    });
    const ground = Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, {
      isStatic: true,
    });
    const leftSide = Bodies.rectangle(
      800 + offset,
      300,
      50.5,
      600.5 + 2 * offset,
      { isStatic: true }
    );
    const rightSide = Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, {
      isStatic: true,
    });
  
    World.add(engine.world, [
      bodiesRef.current.ball,
      bodiesRef.current.paddle,
      ceiling,
      ground,
      leftSide,
      rightSide,
      ...bodiesRef.current.grid
    ]);

    // create a renderer
    const render = Render.create({
      element: divRef.current || undefined,
      engine: engine,
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
  }, [divRef]);

  useGameControls({
    leftArrow: () => {
      Body.translate(bodiesRef.current.paddle, {x: -5, y: 0});
    },
    rightArrow: () => {
      Body.translate(bodiesRef.current.paddle, {x: 5, y: 0});
    }
  });

  return <div ref={divRef} />;
}
