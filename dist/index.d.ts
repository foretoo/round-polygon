declare type Point = {
    x: number;
    y: number;
};
declare type InitPoint = Point & {
    r?: number;
};
declare type RoundedSide = Point & {
    length: number;
};
declare type Angles = {
    main: number;
    prev: number;
    next: number;
    bis: number;
    dir: number;
    vel: number;
};
declare type Linked<T> = T & {
    id: number;
    prev: Linked<T>;
    next: Linked<T>;
};
declare type RoundedPoint = Linked<Point & {
    offset: number;
    angle: Omit<Angles, "vel">;
    in: RoundedSide;
    out: RoundedSide;
    arc: Point & {
        radius: number;
    };
}>;

declare const getSegments: (points: RoundedPoint[], type: "LENGTH" | "AMOUNT", opt: number) => Point[];

declare const roundPolygon: (points: InitPoint[], radius?: number) => RoundedPoint[];

export { InitPoint, Point, RoundedPoint, roundPolygon as default, getSegments };
