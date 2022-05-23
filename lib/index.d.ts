declare type Point = {
  x: number;
  y: number;
}

declare type RoundedPoint = Point & {
  offset: number;
  angle: {
    main: number;
    prev: number;
    next: number;
    bis:  number;
    dir:  number;
  };
  in:   Point & { length: number };
  out:  Point & { length: number };
  arc:  Point & { radius: number };
  id:   number;
  prev: RoundedPoint;
  next: RoundedPoint;
};

declare const roundPolygon: (
  points: Point[], radius: number
) => RoundedPoint[];

export { roundPolygon as default, type Point, type RoundedPoint };
