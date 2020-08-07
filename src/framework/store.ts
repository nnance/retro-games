import { Entity, Component, idFactory } from "../engine";
import { atom, useSetRecoilState, selectorFamily, SetterOrUpdater } from "recoil";
import React from "react";

type TypeChecker = (obj: Component) => obj is Component;

export const entityListState = atom<Entity[]>({
  key: "entityListState",
  default: [],
});

export const componentList = atom<Component[]>({
  key: "componentList",
  default: [],
});

export const useRegisterEntity = (family: string): Entity => {
  const setEntities = useSetRecoilState(entityListState);
  const entity = React.useRef<Entity>({
    id: idFactory(),
    family,
  });

  React.useEffect(() => {
    setEntities((cur) => [...cur, entity.current]);
  }, [entity, setEntities]);

  return entity.current;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const traitSelector = <T extends Component>(
  key: string,
  checker: TypeChecker
) =>
  selectorFamily<T | undefined, number>({
    key,
    get: (id) => ({ get }) =>
      get(componentList).find(
        (component) => checker(component) && component.entity.id === id
      ) as T,
    set: (id) => ({ set }, newValue) =>
      set(componentList, (prev) =>
        prev.map((component) =>
          checker(component) && component.entity.id === id ? newValue : component
        )
      ),
  });

export const registerState = (
  component: Component,
  checker: TypeChecker,
  state: [Component[], SetterOrUpdater<Component[]>]
) => (): void => {
  const [components, setComponents] = state;
  const current = components.find((_) => checker(_) && _.entity === component.entity);
  if (!current) setComponents((cur) => [...cur, component]);
};
