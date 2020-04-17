import { gaps } from "./gaps";
import { config } from "./config";

export interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Direction = "top" | "left" | "bottom" | "right";

function clone(geometry: Geometry) {
  const { x, y, width, height } = geometry;
  return { x, y, width, height };
}

function distance(geometryA: Geometry, geometryB: Geometry) {
  return Math.abs(geometryA.x - geometryB.x) + Math.abs(geometryA.y - geometryB.y);
}

function moveTo(geometryA: Geometry, geometryB: Geometry) {
  const geometryC = clone(geometryB);
  geometryC.height = geometryA.height;
  geometryC.width = geometryA.width;
  return geometryC;
}

function center(geometryA: Geometry, geometryB: Geometry) {
  geometryB.x += geometryB.width * 0.5 - geometryA.width * 0.5;
  geometryB.y += geometryB.height * 0.5 - geometryA.height * 0.5;
  return moveTo(geometryA, geometryB);
}

function withGaps(geometry: Geometry): Geometry {
  const { size } = gaps;
  var { x, y, width, height } = geometry;

  x += size;
  y += size;
  width -= size * 2;
  height -= size * 2;

  return { x, y, width, height };
}

function withMargins(geometry: Geometry): Geometry {
  var { x, y, width, height } = geometry;

  y += gaps.size + config.margins.top;
  x += gaps.size + config.margins.left;

  height -= gaps.size * 2 + config.margins.top + config.margins.bottom;
  width -= gaps.size * 2 + config.margins.left + config.margins.right;

  return { x, y, width, height };
}

export const geometryUtils = {
  clone,
  distance,
  moveTo,
  center,
  withGaps,
  withMargins,
};
