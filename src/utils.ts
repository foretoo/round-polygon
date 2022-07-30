import { InitPoint } from "./types"

export const round = (n: number) => Math.round(n * 1e10) / 1e10

export const getLength = (
  A: InitPoint, B: InitPoint,
) => round(Math.sqrt((B.x - A.x)*(B.x - A.x) + (B.y - A.y)*(B.y - A.y)))

export const PI = Math.PI, TAU = PI * 2

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
  prevpoint: InitPoint,
  currpoint: InitPoint,
  nextpoint: InitPoint,
  prevlen: number,
  mainlen: number,
  nextlen: number,
) => {
  const
    prev = Math.atan2(prevpoint.y - currpoint.y, prevpoint.x - currpoint.x),
    next = Math.atan2(nextpoint.y - currpoint.y, nextpoint.x - currpoint.x),
    main = Math.acos((prevlen*prevlen + nextlen*nextlen - mainlen*mainlen) / (2*prevlen*nextlen)),
    vel = 1 / Math.tan(main / 2),
    dir = getClockDir(prev, next),
    bis = prev + dir * main / 2

  return { prev, next, main, vel, dir, bis }
}