import React from "react";

type Point = [number, number];

const rotatePolygon = (angle: number, offsets: Point[]): Point[] => {
  return offsets.map((offset) => [
    offset[0] * Math.sin(angle) - offset[1] * Math.cos(angle),
    offset[0] * Math.cos(angle) + offset[1] * Math.sin(angle),
  ]);
};

const Box = ({ x, y }: { x: number; y: number }) => {
  const points: Point[] = [
    [-40, 40],
    [-40, -40],
    [40, -40],
    [40, 40],
  ];

  const rotated = rotatePolygon(45, points);

  return (
    <polygon
      stroke="black"
      fill="none"
      strokeWidth="2"
      transform={`translate(${x},${y})`}
      points={rotated.toString()}
    />
  );
};

function Board(
  props: React.PropsWithChildren<{ width: number; height: number }>
): React.ReactElement {
  return (
    <svg width={props.width} height={props.height}>
      {props.children}
    </svg>
  );
}

export default function Polygon(): React.ReactElement {
  const Height = window.innerHeight - 20;
  const Width = window.innerWidth - 10;

  return (
    <Board width={Width} height={Height}>
      <Box x={500} y={200} />
      <Box x={550} y={50} />
    </Board>
  );
}
