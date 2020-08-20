import React from "react";

const CANVAS = { width: 800, height: 600 };

const Ship = ({ x, y }: { x: number; y: number }) => {

  const points = [
    [3, 0],
    [-3, -2],
    [-1, 0],
    [-3, 2],
    [3, 0],
  ];

  return (
    <path
      d={`M${x + 6},${y}
          L${x - 6},${y - 4}
          L${x - 2},${y}
          L${x - 6},${y + 4}
          L${x + 6},${y}
          z
        `}
      style={{
        stroke: "grey",
        fill: "none",
      }}
    />
  );
};

function Board(
  props: React.PropsWithChildren<{ width: number; height: number }>
): React.ReactElement {
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

export default function SVGPath(): React.ReactElement {
  return (
    <Board width={CANVAS.width} height={CANVAS.height}>
      <Ship x={50} y={50}/>
    </Board>
  );
}
