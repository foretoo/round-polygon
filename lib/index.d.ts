declare type RoundedPoint = {
  x: number;
  y: number;
  offset: number;
  angle: {
    main: number;
    prev: number;
    next: number;
    bis: number;
    dir: number;
    vel: number;
  };
  in: {
    x: number;
    y: number;
    length: number;
  };
  out: {
    x: number;
    y: number;
    length: number;
  };
  arc: {
    x: number;
    y: number;
    radius: number;
  };
  id: number;
  prev: RoundedPoint;
  next: RoundedPoint;
};

declare const roundPolygon: (
  points: { x: number, y: number }[], radius: number
) => RoundedPoint[];

export default roundPolygon;
