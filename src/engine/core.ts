const MAX_NUM = 100000;

export interface Entity {
  id: number;
  family: string;
}

export const idFactory = (): number => Math.floor(Math.random() * MAX_NUM);

export const entityFactory = (family: string): Entity => ({
  id: idFactory(),
  family,
});

export interface Component {
  entity: Entity;
}

export type System = (entity: Component[]) => Component[];

export const componentsByEntity = (components: Component[]): Component[][] => {
  const ordered = components.sort((a, b) => a.entity.id - b.entity.id);
  const entities = ordered.reduce<Component[][]>((prev, comp, idx) => {
    const entities =
      idx === 0 || ordered[idx - 1].entity !== comp.entity
        ? [...prev, []]
        : prev;
    entities[entities.length - 1].push(comp);
    return entities;
  }, []);
  return entities;
};

export const updater = (systems: System[]) => {
  return (components: Component[]): Component[] =>
    systems.reduce((prev, system) => system(prev), components);
};
