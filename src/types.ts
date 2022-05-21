type Point = {
  x: number
  y: number
}

type RoundedSide = Point & {
  length: number
}

type Angles = {
  main: number
  prev: number
  next: number
  bis: number
  dir: number
  vel: number
}

type RoundedPoint = Point & {
  offset: number
  angle: Angles
  in: RoundedSide
  out: RoundedSide
  arc: Point & {
    radius: number,
  }
}

type PreRoundedPoint = Omit<RoundedPoint, "in" | "out" | "arc"> & {
  in:  { length: number, rest: number }
  out: { length: number, rest: number }
  arc: { radius: number, hit: number }
}

type Linked<T> = T & {
  id: number
  prev: T
  next: T
}

export {
  type Point,
  type Linked,
  type PreRoundedPoint,
  type RoundedPoint,
}