import React, { Fragment } from "react";
import { Engine, Bodies, World, Events, Body, Composite } from "matter-js";
import { useGameControls } from "../framework/controller";
import { useRegisterBody, engineState, useBodyContext } from "../framework";
import { useRecoilValue, RecoilRoot } from "recoil";

const offset = 10;
const brickSize = { width: 60, height: 20 };
const rows = 2;
const cols = 7;

const Brick = ({ col, row }: { col: number; row: number }) => {
  const { width, height } = brickSize;
  const body = useRegisterBody(
    Bodies.rectangle(200 + width * col, 150 + row * height, width, height, {
      isStatic: true,
      label: "brick",
    })
  );
  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Grid = () => {
  const engine = useRecoilValue(engineState);

  React.useEffect(() => {
    const callback = (events: Matter.IEventCollision<Engine>) => {
      const pairs = events.pairs;
      pairs.forEach((pair) => {
        if (pair.bodyA.label === "brick")
          World.remove(engine.world, pair.bodyA);
        if (pair.bodyB.label === "brick")
          World.remove(engine.world, pair.bodyB);
      });
    };

    Events.on(engine, "collisionEnd", callback);
    return () => Events.off(engine, "collisionEnd", callback);
  }, [engine]);

  return (
    <Fragment>
      {Array.from(Array(rows), (_, row) => {
        return Array.from(Array(cols), (_, col) => {
          return <Brick key={row * col} col={col} row={row} />;
        });
      })}
    </Fragment>
  );
};

const Ball = () => {
  const radius = 10;

  const body = useRegisterBody(
    Bodies.circle(400, 200, radius, {
      inertia: Infinity,
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      force: { x: 0.003, y: 0.003 },
    })
  );

  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Paddle = () => {
  const engine = useRecoilValue(engineState);
  const [paddleVelocity, setVelocity] = React.useState(0);

  const body = useRegisterBody(
    Bodies.rectangle(450, 500, 80, 20, { isStatic: true })
  );

  // update paddle state before engine updates
  React.useEffect(() => {
    const callback = () => {
      const matter = Composite.allBodies(engine.world).find(
        (_) => _.id === body?.id
      );
      if (matter) Body.translate(matter, { x: paddleVelocity, y: 0 });
    };

    Events.on(engine, "beforeUpdate", callback);
    return () => Events.off(engine, "beforeUpdate", callback);
  }, [body, engine, paddleVelocity]);

  useGameControls({
    leftArrow: () => setVelocity(-7),
    rightArrow: () => setVelocity(7),
    keyUp: () => setVelocity(0),
  });

  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Ceiling = () => {
  const body = useRegisterBody(
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, {
      isStatic: true,
    })
  );
  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Ground = () => {
  const body = useRegisterBody(
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, {
      isStatic: true,
    })
  );
  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const LeftSide = () => {
  const body = useRegisterBody(
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, {
      isStatic: true,
    })
  );
  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const RightSide = () => {
  const body = useRegisterBody(
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, {
      isStatic: true,
    })
  );
  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

const Board = (
  props: React.PropsWithChildren<{ width: number; height: number }>
) => {
  const engine = useRecoilValue(engineState);
  useBodyContext();

  React.useEffect(() => {
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;

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
};

export default function PaddleRecoil(): React.ReactElement {
  return (
    <RecoilRoot>
      <Board width={800} height={600}>
        <Ground />
        <Ceiling />
        <RightSide />
        <LeftSide />
        <Paddle />
        <Ball />
        <Grid />
      </Board>
    </RecoilRoot>
  );
}
