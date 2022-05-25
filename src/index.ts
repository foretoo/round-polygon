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
  preRoundedPoints.sort((a, b) => a.id - b.id)

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

  const prev = curr.prev
  const next = curr.next
  const _prev  = prev.prev
  const _next  = next.next
  const _pprev = _prev.prev
  const _nnext = _next.next

  if (radius >= curr.arc.hit) {
    if (curr.arc.hit === next.arc.hit) {

      curr.arc.radius = curr.arc.hit
      next.arc.radius = curr.arc.hit

      calcOffset(curr)
      calcOffset(next)

      _next.arc.hit = Math.min(
        _next.out.length / (_next.angle.vel + _nnext.angle.vel),
        _next.in.rest / _next.angle.vel
      )
      prev.arc.hit = Math.min(
        prev.in.length / (prev.angle.vel + _prev.angle.vel),
        prev.out.rest / prev.angle.vel
      )
    }
    else if (curr.arc.hit === prev.arc.hit) {

      curr.arc.radius = curr.arc.hit
      prev.arc.radius = curr.arc.hit
      
      calcOffset(prev)
      calcOffset(curr)

      _prev.arc.hit = Math.min(
        _prev.in.length / (_prev.angle.vel + _pprev.angle.vel),
        _prev.out.rest / _prev.angle.vel
      )
      next.arc.hit = Math.min(
        next.out.length / (next.angle.vel + _next.angle.vel),
        next.in.rest / next.angle.vel
      )
    }
    else {

      if (prev.locked && !next.locked) {
        curr.arc.radius = Math.min(
          curr.in.rest / curr.angle.vel,
          curr.out.length / (curr.angle.vel + next.angle.vel),
          curr.arc.radius
        )
      }
      if (next.locked && !prev.locked) {
        curr.arc.radius = Math.min(
          curr.out.rest / curr.angle.vel,
          curr.in.length / (curr.angle.vel + prev.angle.vel),
          curr.arc.radius
        )
      }
      if (next.locked && prev.locked) {          
        curr.arc.radius = Math.min(
          curr.in.rest / curr.angle.vel,
          curr.out.rest / curr.angle.vel,
          curr.arc.radius
        )
      }

      calcOffset(curr)
      
    }
  }
  else {
    calcOffset(curr)
  }
}



const calcOffset = (curr: Linked<PreRoundedPoint>) => {
  curr.offset = curr.arc.radius * curr.angle.vel

  curr.prev.out.rest -= curr.offset
  curr.in.rest -= curr.offset
  curr.out.rest -= curr.offset
  curr.next.in.rest -= curr.offset

  curr.locked = true
}



const getMinHit = (
  arr: Linked<PreRoundedPoint>[]
): Linked<PreRoundedPoint> | null => {

  let min: Linked<PreRoundedPoint> | null = null
  arr.forEach((p) => {
    if (!p.locked) 
      min = !min ? p : p.arc.hit < min.arc.hit ? p : min
  })
  return min
}



export default roundPolygon