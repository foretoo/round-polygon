import { InitPoint, Linked, PreRoundedPoint, RoundedPoint } from "./types"
import { getLength, getAngles } from "./utils"



const roundPolygon = (
  points: InitPoint[], radius: number = 0
): Linked<RoundedPoint>[] => {

  // prepare points, calc angles
  const preRoundedPoints: Linked<PreRoundedPoint>[] =
  points.map((curr, id) => {
    
    const
      prev = points[(id - 1 + points.length) % points.length],
      next = points[(id + 1) % points.length],
      nextLength = getLength(curr, next),
      prevLength = getLength(prev, curr),
      angle = getAngles(prev, curr, next),
      lim = curr.r !== undefined ? Math.min(nextLength / angle.vel, prevLength / angle.vel, curr.r) : 0

    return {
      ...curr,
      angle,
      offset: 0,
      arc: { radius, hit: radius, lim },
      in: { length: prevLength, rest: prevLength },
      out: { length: nextLength, rest: nextLength },
      locked: false,
      id,
      get prev() { return preRoundedPoints[(id - 1 + points.length) % points.length] },
      get next() { return preRoundedPoints[(id + 1) % points.length] },
    }
  })


  // calc collision radius for each point
  preRoundedPoints.forEach((p) => {
    p.arc.hit = Math.min(
      p.out.length / (p.angle.vel + p.next.angle.vel),
      p.in.length  / (p.angle.vel + p.prev.angle.vel),
    )
  })


  // calc limit radius and its offsets
  const preRoundedLimPoints = preRoundedPoints.filter((p) => p.arc.lim > 0)
  if (preRoundedLimPoints.length) {
    let minLimPoint = getMinLim(preRoundedLimPoints)
    while (minLimPoint) {
      calcLimit(minLimPoint)
      minLimPoint = getMinLim(preRoundedLimPoints)
    }
  }
  

  // calc common radius and its offsets
  const preRoundedZeroLimPoints = preRoundedPoints.filter((p) => p.arc.lim === 0)
  if (preRoundedZeroLimPoints.length && radius > 0) {
    let minHitPoint = getMinHit(preRoundedPoints)
    while (minHitPoint) {
      calcRound(minHitPoint, radius)
      minHitPoint = getMinHit(preRoundedPoints)
    }
  }


  // final calc coordinates
  const roundedPoints: Linked<RoundedPoint>[] = 
  preRoundedPoints.map((p) => {

    const bisLength = p.arc.radius / Math.sin(p.angle.main / 2)

    return {
      id: p.id,
      x: p.x,
      y: p.y,
      angle: {
        main: p.angle.main,
        prev: p.angle.prev,
        next: p.angle.next,
        bis:  p.angle.bis,
        dir:  p.angle.dir,
      },
      offset: p.offset,
      arc: {
        radius: p.arc.radius,
        x: p.x + Math.cos(p.angle.bis) * bisLength,
        y: p.y + Math.sin(p.angle.bis) * bisLength,
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
      get prev() { return roundedPoints[(p.id - 1 + points.length) % points.length] },
      get next() { return roundedPoints[(p.id + 1) % points.length] },
    }
  })

  return roundedPoints
}



const calcLimit = (
  curr: Linked<PreRoundedPoint>,
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



const calcRound = (
  curr:   Linked<PreRoundedPoint>,
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

    lockPoint(curr)
  }

  else lockPoint(curr)
}



const lockPoint = (curr: Linked<PreRoundedPoint>) => {
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
    prev.out.rest / prev.angle.vel
  )
  next.arc.hit = Math.min(
    next.out.length / (next.angle.vel + next.next.angle.vel),
    next.in.rest / next.angle.vel
  )
}



const getMinLim = (
  arr: Linked<PreRoundedPoint>[]
) => (
  arr.reduce((min: Linked<PreRoundedPoint> | null, p) =>
    p.locked ? min : !min ? p : p.arc.lim < min.arc.lim ? p : min,
    null
))

const getMinHit = (
  arr: Linked<PreRoundedPoint>[]
) => (
  arr.reduce((min: Linked<PreRoundedPoint> | null, p) => 
    p.locked ? min : !min ? p : p.arc.hit < min.arc.hit ? p : min,
    null
))



export default roundPolygon