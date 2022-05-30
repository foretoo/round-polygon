declare type InitPoint = {
  x:  number;
  y:  number;
  r?: number;
}

declare type RoundedPoint = {
  x: number;
  y: number;
  offset: number;
  angle: {
    main: number;
    prev: number;
    next: number;
    bis:  number;
    dir:  number;
  };
  in:   { x: number; y: number; length: number };
  out:  { x: number; y: number; length: number };
  arc:  { x: number; y: number; radius: number };
  id:   number;
  prev: RoundedPoint;
  next: RoundedPoint;
};

declare const roundPolygon: (
  points: InitPoint[], radius: number
) => RoundedPoint[];

export { roundPolygon as default, type InitPoint, type RoundedPoint };
