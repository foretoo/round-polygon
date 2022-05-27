type Point = { x: number, y: number }
type InitPoint = Point & { r?: number }

type Angles = {
  main: number
  prev: number
  next: number
  bis: number
  dir: number
  vel: number
}

type PreRoundedPoint = Point & {
  offset: number
  angle: Angles
  in:  { length: number, rest: number }
  out: { length: number, rest: number }
  arc: { radius: number, hit: number, lim?: number }
  locked: boolean
}

type RoundedSide = Point & { length: number }

type RoundedPoint = Point & {
  offset: number
  angle: Omit<Angles, "vel">
  in: RoundedSide
  out: RoundedSide
  arc: Point & { radius: number }
}

type Linked<T> = T & {
  id: number
  prev: Linked<T>
  next: Linked<T>
}

export {
  type InitPoint,
  type Linked,
  type PreRoundedPoint,
  type RoundedPoint,
}