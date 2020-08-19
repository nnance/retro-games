import React from "react";
import { useRecoilValue, RecoilRoot, atom, useRecoilState } from "recoil";
import {
  engineState,
  useBodyContext,
  useRegisterBody,
  useGameControls,
  KeyCode,
} from "../framework";
import { Engine, Bodies, Vertices, Body, Composite, Events } from "matter-js";

const FPS = 60;
const CANVAS = { width: 800, height: 600 };
const SHIP_SIZE = 5;
const TURN_SPEED = 180; // deg per second
const SHIP_THRUST = 0.005; // acceleration of the ship in pixels per sec

const shipState = atom({
  key: "shipState",
  default: {
    rotation: 0,
    thrustersOn: false,
  },
});

const Ship = ({ x, y }: { x: number; y: number }) => {
  const [controls, setControls] = useRecoilState(shipState);

  const engine = useRecoilValue(engineState);

  const points = [
    [3, 0],
    [-3, -2],
    [-1, 0],
    [-3, 2],
    [3, 0],
  ];

  const vertices: Matter.Vector[] = points.map((point) => ({
    x: point[0],
    y: point[1],
  }));

  const scaled = Vertices.scale(vertices, SHIP_SIZE, SHIP_SIZE, { x, y });

  const body = useRegisterBody(
    Bodies.fromVertices(x, y, [scaled])
  );

  useGameControls({
    rightArrow: () =>
      setControls((state) => ({
        ...state,
        rotation: ((TURN_SPEED / 180) * Math.PI) / FPS,
      })),
    leftArrow: () =>
      setControls((state) => ({
        ...state,
        rotation: ((-TURN_SPEED / 180) * Math.PI) / FPS,
      })),
    keyUp: (keyCode?: number) => {
      if (keyCode === KeyCode.rightArrow || keyCode === KeyCode.leftArrow) {
        setControls((state) => ({ ...state, rotation: 0 }));
      } else if (keyCode === KeyCode.upArrow) {
        setControls((state) => ({ ...state, thrustersOn: false }));
      }
    },
    upArrow: () => setControls((state) => ({ ...state, thrustersOn: true })),
  });

  React.useEffect(() => {
    const getMatter = () => {
      const matter = Composite.allBodies(engine.world).find(
        (_) => _.id === body?.id
      );
      if (matter) {
        Body.rotate(matter, controls.rotation);
        if (controls.thrustersOn) {
          Body.applyForce(matter, matter.position, {
            x: (SHIP_THRUST * Math.cos(matter.angle)) / FPS,
            y: (SHIP_THRUST * Math.sin(matter.angle)) / FPS,
          });
        }
      }
    };
    Events.on(engine, "beforeUpdate", getMatter);
    return () => Events.off(engine, "beforeUpdate", getMatter);
  }, [body, engine, controls]);

  return <polygon stroke="grey" points={body?.points?.toString()} />;
};

function Board(
  props: React.PropsWithChildren<{ width: number; height: number }>
): React.ReactElement {
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
}

export default function BoxesRecoil(): React.ReactElement {
  return (
    <RecoilRoot>
      <Board width={CANVAS.width} height={CANVAS.height}>
        <Ship x={400} y={300} />
      </Board>
    </RecoilRoot>
  );
}
