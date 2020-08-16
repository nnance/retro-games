import React from "react";
import { atom, useSetRecoilState, selectorFamily, useRecoilValue } from "recoil";
import { Engine, World, Composite, Events } from "matter-js";

export const engineState = atom({
  key: "engineState",
  default: Engine.create(),
});

export type Body = {
  id: number;
  position: Matter.Vector;
  points: [number, number][];
};

export const bodyList = atom<Body[]>({
  key: "bodyList",
  default: [],
});

export const bodySelector = selectorFamily({
  key: "bodySelector",
  get: (id) => ({ get }) => {
    return get(bodyList).find((body) => body.id === id);
  },
});

export const useRegisterBody = (
  body: Matter.Body
): React.MutableRefObject<Matter.Body> => {
  const engine = useRecoilValue(engineState);
  const ref = React.useRef(body);

  React.useEffect(() => {
    World.add(engine.world, ref.current);
  }, [engine.world, ref]);

  return ref;
};

export const useBodyContext = (): void => {
  const engine = useRecoilValue(engineState);
  const setBodies = useSetRecoilState(bodyList);

  React.useEffect(() => {
    const afterUpdate = () => {
      const bodies = Composite.allBodies(engine.world);
      setBodies(
        bodies.map((body) => ({
          id: body.id,
          position: { ...body.position },
          points: body.vertices.map((vector) => [vector.x, vector.y]),
        }))
      );
    };

    Events.on(engine, "afterUpdate", afterUpdate);
    return () => Events.off(engine, "afterUpdate", afterUpdate);
  }, [engine, setBodies]);
};
