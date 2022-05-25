import { Point, Linked, PreRoundedPoint, RoundedPoint } from "./types"
import { getLength, getAngles } from "./utils"



const roundPolygon = (
  points: Point[], radius: number
): Linked<RoundedPoint>[] => {

  // prepare points, calc angles
  const preRoundedPoints: Linked<PreRoundedPoint>[] =
  points.map((curr, id) => {

    const
      prev = points[(id - 1 + points.length) % points.length],
      next = points[(id + 1) % points.length],
      next_length = getLength(curr, next),
      prev_length = getLength(prev, curr),
      angle = getAngles(prev, curr, next)

    return {
      ...curr,
      angle,
      offset: 0,
      arc: { radius, hit: radius },
      in: { length: prev_length, rest: prev_length },
      out: { length: next_length, rest: next_length },
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

  // calc valid radius and offset of rounding
  let minHitPoint = getMinHit(preRoundedPoints)
  while (minHitPoint) {
    calcRound(minHitPoint, radius)
    minHitPoint = getMinHit(preRoundedPoints)
  }

  // final calc coordinates
  const roundedPoints: Linked<RoundedPoint>[] =
  preRoundedPoints.map((p, id) => {

    const
      bisLength = p.arc.radius / Math.sin(p.angle.main / 2)

    return {
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
      id,
      get prev() { return roundedPoints[(id - 1 + points.length) % points.length] },
      get next() { return roundedPoints[(id + 1) % points.length] },
    }
  })

  return roundedPoints
}



const calcRound = (
  curr:   Linked<PreRoundedPoint>,
  radius: number
) => {
  if (radius >= curr.arc.hit) {

    const prev = curr.prev,
          next = curr.next

    if (prev.locked && !next.locked)
      curr.arc.radius = Math.min(
        curr.in.rest / curr.angle.vel,
        curr.out.length / (curr.angle.vel + next.angle.vel),
        curr.arc.radius
      )

    else if (next.locked && !prev.locked)
      curr.arc.radius = Math.min(
        curr.out.rest / curr.angle.vel,
        curr.in.length / (curr.angle.vel + prev.angle.vel),
        curr.arc.radius
      )

    else if (next.locked && prev.locked)
      curr.arc.radius = Math.min(
        curr.in.rest / curr.angle.vel,
        curr.out.rest / curr.angle.vel,
        curr.arc.radius
      )

    else curr.arc.radius = curr.arc.hit

    lockPoint(curr)
    
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

  else lockPoint(curr)
}



const lockPoint = (curr: Linked<PreRoundedPoint>) => {
  curr.offset = curr.arc.radius * curr.angle.vel

  curr.prev.out.rest -= curr.offset
  curr.in.rest -= curr.offset
  curr.out.rest -= curr.offset
  curr.next.in.rest -= curr.offset

  curr.locked = true
}



const getMinHit = (
  arr: Linked<PreRoundedPoint>[]
) => (
  arr.reduce((min: Linked<PreRoundedPoint> | null, p) => 
    p.locked ? min : min ? p.arc.hit < min.arc.hit ? p : min : p,
    null
))



export default roundPolygon