import { System, Component } from "./core";

type Vector = {
  x: number;
  y: number;
};

export interface Position extends Component {
  x: number;
  y: number;
}

export const isPosition = (component: Component): component is Position => {
  return (component as Position).x !== undefined;
};

export interface Velocity extends Component {
  vx: number;
  vy: number;
  mass: number;
}

export const isVelocity = (component: Component): component is Velocity => {
  return (component as Velocity).mass !== undefined;
};

export const computeForce = (velocity: Velocity): Vector => {
  const force: Vector = { x: 0, y: velocity.mass * -9.81 };
  return { x: force.x / velocity.mass, y: force.y / velocity.mass };
};

export const forceSystem: System = (components) => {
  return components.map((component) => {
    if (isVelocity(component) && component.mass) {
      const force = computeForce(component);
      return {
        ...component,
        vx: component.vx + force.x,
        vy: component.vy + force.y,
      };
    } else return component;
  });
};

export const movementSystem: System = (components) => {
  return components.map((component) => {
    if (isPosition(component)) {
      const vel = components.find(
        (_) => isVelocity(_) && _.entity.id === component.entity.id
      ) as Velocity | undefined;
      if (vel) {
        return {
          ...component,
          x: component.x + vel.vx,
          y: component.y + vel.vy,
        };
      } else return component;
    } else return component;
  });
};
