import {
  Velocity,
  entityFactory,
  Position,
  updater,
  forceSystem,
  movementSystem,
  isPosition,
} from "./core";

test("movement system", () => {
  const entity = entityFactory("ball");
  const pos: Position = { entity, x: 100, y: 100 };
  const velocity: Velocity = { entity, vx: 1, vy: 1, mass: 0 };

  const update = updater([forceSystem, movementSystem]);
  const cycle1 = update([pos, velocity]);

  expect(cycle1.find(isPosition)?.x).toEqual(101);
  expect(cycle1.find(isPosition)?.y).toEqual(101);
});

test("force system", () => {
  const entity = entityFactory("ball");
  const pos: Position = { entity, x: 100, y: 100 };
  const velocity: Velocity = { entity, vx: 0, vy: 0, mass: 1 };

  const update = updater([forceSystem, movementSystem]);
  const cycle1 = update([pos, velocity]);

  expect(cycle1.find(isPosition)?.x).toEqual(100);
  expect(cycle1.find(isPosition)?.y).toEqual(90.19);

  const cycle2 = update(cycle1);
  expect(cycle2.find(isPosition)?.y).toEqual(70.57);

  const cycle3 = update(cycle2);
  const position = cycle3.find(isPosition) as Position;
  expect(Number(position.y.toFixed(2))).toEqual(41.14);
});
