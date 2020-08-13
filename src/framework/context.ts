import React from "react";
import { Engine, World, Events, Composite } from "matter-js";

export const EngineContext = React.createContext(Engine.create());
export const BodyContext = React.createContext<
  [Matter.Body[], React.Dispatch<React.SetStateAction<Matter.Body[]>>]
>([[], () => undefined]);

export const useBodyContext = (): void => {
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

export const useRegisterBody = (body: Matter.Body): React.MutableRefObject<Matter.Body> => {
  const engine = React.useContext(EngineContext);
  const ref = React.useRef(body);

  React.useEffect(() => {
    World.add(engine.world, ref.current);
  }, [ref, engine.world]);

  return ref;
}
