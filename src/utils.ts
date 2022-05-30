import { InitPoint } from "./types"

export const getLength = (
  A: InitPoint, B: InitPoint,
) => Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2))

export const getAngle = (
  A: InitPoint, B: InitPoint, C?: InitPoint,
) => {
  if (!C)
    return Math.atan2(B.y - A.y, B.x - A.x)
  else {
    const AB = getLength(A, B),
          BC = getLength(B, C),
          CA = getLength(C, A)

    return Math.acos((AB*AB + BC*BC - CA*CA) / (2*AB*BC))
  }
}

const PI = Math.PI, TAU = PI * 2

export const getClockDir = (
  angle1: number, angle2: number
) => {
  const diff = angle2 - angle1
  return (
    (diff > PI && diff < TAU) ||
    (diff < 0  && diff > -PI)
    ? -1 : 1
  )
}

export const getAngles = (
  prev_point: InitPoint,
  curr_point: InitPoint,
  next_point: InitPoint,
) => {
  const
    main = getAngle(prev_point, curr_point, next_point),
    prev = getAngle(curr_point, prev_point),
    next = getAngle(curr_point, next_point),
    vel = 1 / Math.tan(main / 2),
    dir  = getClockDir(prev, next),
    bis  = prev + dir * main / 2
  
  return { main, next, prev, vel, dir, bis }
}

export const assignValue = <T>(
  value: T, arr: T[], length: number
) => {
  if (arr.length < length) arr.push(value)
  else {
    for (let i = 0; i < arr.length - 1; i++) {
      arr[i] = arr[i + 1]
    }
    arr[length - 1] = value
  }
}