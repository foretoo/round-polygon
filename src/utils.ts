import { Point } from "./types"

export const find_length = (
  A: Point, B: Point,
) => Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2))

export const find_angle = (
  A: Point, B: Point, C?: Point,
) => {
  if (!C)
    return Math.atan2(B.y - A.y, B.x - A.x)
  else {
    const AB = find_length(A, B),
          BC = find_length(B, C),
          CA = find_length(C, A)

    return Math.acos((AB*AB + BC*BC - CA*CA) / (2*AB*BC))
  }
}

const PI = Math.PI, TAU = PI * 2

export const get_clock_dir = (
  angle1: number, angle2: number
) => {
  const diff = angle2 - angle1
  return (
    (diff > PI && diff < TAU) ||
    (diff < 0  && diff > -PI)
    ? -1 : 1
  )
}

export const get_angles = (
  prev_point: Point,
  curr_point: Point,
  next_point: Point,
) => {
  const
    main = find_angle(prev_point, curr_point, next_point),
    prev = find_angle(curr_point, prev_point),
    next = find_angle(curr_point, next_point),
    dir  = get_clock_dir(prev, next),
    bis  = prev + dir * main / 2
  
  return { main, next, prev, bis, dir }
}

export const getprev =
  <T>(i: number, arr: T[]): T =>
    arr[(i - 1 + arr.length) % arr.length]

export const getnext =
  <T>(i: number, arr: T[]): T =>
    arr[(i + 1) % arr.length]
