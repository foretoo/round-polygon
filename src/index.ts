import { InitPoint, PreRoundedPoint, RoundedPoint } from "./types"
import { round, getLength, getAngles, PI } from "./utils"



const roundPolygon = (
  points: InitPoint[], radius: number = 0
): RoundedPoint[] => {

  const
    len = points.length,
    preRoundedPoints: PreRoundedPoint[] = [],
    limPoints: PreRoundedPoint[] = [],
    noLimPoints: PreRoundedPoint[] = [],
    zeroLimPoints: PreRoundedPoint[] = []

  // prepare points, calc angles
  points.forEach((curr, id) => {

    const
      prev = points[(id - 1 + len) % len],
      next = points[(id + 1) % len],
      prevlen = getLength(prev, curr),
      mainlen = getLength(prev, next),
      nextlen = getLength(curr, next),
      angle = getAngles(prev, curr, next, prevlen, mainlen, nextlen)

    if (angle.main === 0) {
      angle.main = Number.EPSILON
      angle.vel = Number.MAX_SAFE_INTEGER
    }
    if (angle.main === PI) angle.vel = 0

    const preRoundedPoint = {
      x: curr.x,
      y: curr.y,
      angle,
      offset: 0,
      arc: {
        radius,
        hit: radius,
        // limit lim to prevent offset to become bigger than prev/next length
        lim: Math.min(nextlen / angle.vel, prevlen / angle.vel, curr.r || 0)
      },
      in: { length: prevlen, rest: prevlen },
      out: { length: nextlen, rest: nextlen },
      locked: false,
      id,
      get prev() { return preRoundedPoints[(id - 1 + len) % len] },
      get next() { return preRoundedPoints[(id + 1) % len] },
    }

    // if point overlaps another point
    if (isNaN(angle.main)) {
      angle.main = 0
      angle.bis = angle.prev || angle.next // :)
      zeroLimPoints.push(preRoundedPoint)
    }

    // spread points into either limited, zero-limited or none-limited lists
    // ( is limited if point has own radius to round )
    if (typeof curr.r === "number")
      if (curr.r === 0) zeroLimPoints.push(preRoundedPoint)
      else limPoints.push(preRoundedPoint)
    else noLimPoints.push(preRoundedPoint)

    preRoundedPoints.push(preRoundedPoint)
  })


  // lock (overlapped | zero radius) points
  zeroLimPoints.forEach((p) => {
    p.angle.vel = 0
    p.arc.radius = 0
    lockPoint(p)
  })


  // calc collision radius for each point
  preRoundedPoints.forEach((p) => {
    p.arc.hit = Math.min(
      p.out.rest / (p.angle.vel + p.next.angle.vel),
      p.in.rest  / (p.angle.vel + p.prev.angle.vel),
    )
  })


  // calc limit radius and its offsets
  let minHitPoint = getMinHit(limPoints)
  while (minHitPoint) {
    calcLimitRadius(minHitPoint)
    minHitPoint = getMinHit(limPoints)
  }


  // calc common radius and its offsets
  minHitPoint = getMinHit(preRoundedPoints)
  while (minHitPoint) {
    calcCommonRadius(minHitPoint, radius)
    minHitPoint = getMinHit(preRoundedPoints)
  }
  

  // final calc coordinates
  const roundedPoints = preRoundedPoints.map((p) => {

    const bislen = p.arc.radius / Math.sin(p.angle.main / 2)

    return {
      id: p.id,
      x: p.x,
      y: p.y,
      angle: {
        main: round(p.angle.main),
        prev: p.angle.prev,
        next: p.angle.next,
        bis:  p.angle.bis,
        dir:  p.angle.dir,
      },
      offset: round(p.offset),
      arc: {
        radius: round(p.arc.radius),
        x: p.x + (Math.cos(p.angle.bis) * bislen || 0),
        y: p.y + (Math.sin(p.angle.bis) * bislen || 0),
      },
      in: {
        length: p.in.length,
        x: p.x + Math.cos(p.angle.prev) * p.offset,
        y: p.y + Math.sin(p.angle.prev) * p.offset,
      },
      out: {
        length: p.out.length,
        x: p.x + Math.cos(p.angle.next) * p.offset,
        y: p.y + Math.sin(p.angle.next) * p.offset,
      },
      get prev() { return roundedPoints[(p.id - 1 + len) % len] },
      get next() { return roundedPoints[(p.id + 1) % len] },
    }
  })

  return roundedPoints
}



const calcLimitRadius = (
  curr: PreRoundedPoint,
) => {

  const { prev, next } = curr

  // if prev locked
  if (prev.locked && !next.locked)
    curr.arc.radius = Math.min(
      Math.max(
        (curr.out.length - (next.arc.lim * next.angle.vel)) / curr.angle.vel,
        curr.out.length / (curr.angle.vel + next.angle.vel)
      ),
      curr.in.rest / curr.angle.vel,
      curr.arc.lim
    )

  // if next locked
  else if (next.locked && !prev.locked)
    curr.arc.radius = Math.min(
      Math.max(
        (curr.in.length - (prev.arc.lim * prev.angle.vel)) / curr.angle.vel,
        curr.in.length / (curr.angle.vel + prev.angle.vel)
      ),
      curr.out.rest / curr.angle.vel,
      curr.arc.lim
    )

  // if BOTH locked
  else if (next.locked && prev.locked)
    curr.arc.radius = Math.min(
      curr.in.rest / curr.angle.vel,
      curr.out.rest / curr.angle.vel,
      curr.arc.lim
    )

  // if NONE locked
  else
    curr.arc.radius = Math.min(
      Math.max(
        (curr.in.length - (prev.arc.lim * prev.angle.vel)) / curr.angle.vel,
        curr.in.length / (curr.angle.vel + prev.angle.vel)
      ),
      Math.max(
        (curr.out.length - (next.arc.lim * next.angle.vel)) / curr.angle.vel,
        curr.out.length / (curr.angle.vel + next.angle.vel)
      ),
      curr.arc.lim
    )

  lockPoint(curr)
}



const calcCommonRadius = (
  curr:   PreRoundedPoint,
  radius: number
) => {
  
  if (radius > curr.arc.hit) {
    const { prev, next } = curr

    // Math.max(..., 0) cased by somehow getting rest = -2.71e-15 from calcLimit
    if (prev.locked && !next.locked)
      curr.arc.radius = Math.max(Math.min(
        curr.in.rest / curr.angle.vel,
        curr.out.length / (curr.angle.vel + next.angle.vel),
        curr.arc.radius
      ), 0)

    else if (next.locked && !prev.locked)
      curr.arc.radius = Math.max(Math.min(
        curr.out.rest / curr.angle.vel,
        curr.in.length / (curr.angle.vel + prev.angle.vel),
        curr.arc.radius
      ), 0)

    else if (next.locked && prev.locked)
      curr.arc.radius = Math.max(Math.min(
        curr.in.rest / curr.angle.vel,
        curr.out.rest / curr.angle.vel,
        curr.arc.radius
      ), 0)

    else curr.arc.radius = curr.arc.hit
  }

  lockPoint(curr)
}



const lockPoint = (curr: PreRoundedPoint) => {
  const { prev, next } = curr

  curr.offset = curr.arc.radius * curr.angle.vel

  prev.out.rest -= curr.offset
  curr.in.rest  -= curr.offset
  curr.out.rest -= curr.offset
  next.in.rest  -= curr.offset

  curr.locked = true

  // to get right getMinHit then
  prev.arc.hit = Math.min(
    prev.in.length / (prev.angle.vel + prev.prev.angle.vel),
    prev.in.rest / prev.angle.vel,
    prev.out.rest / prev.angle.vel
  )
  next.arc.hit = Math.min(
    next.out.length / (next.angle.vel + next.next.angle.vel),
    next.out.rest / next.angle.vel,
    next.in.rest / next.angle.vel
  )
}



const getMinHit = (
  arr: PreRoundedPoint[]
) => (
  arr.reduce((min: PreRoundedPoint | null, p) => 
    p.locked ? min : !min ? p : p.arc.hit < min.arc.hit ? p : min,
    null
))



export default roundPolygon