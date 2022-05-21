import { Point, Linked, PreRoundedPoint, RoundedPoint } from "./types"
import { getLength, getAngles } from "./utils"



let i: number
const roundPolygon = (
  points: Point[], radius: number
): Linked<RoundedPoint>[] => {

  i = points.length

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

  // calc valid radius and edge offset
  while (i) {
    preRoundedPoints.sort(minArcHit)
    calcRound(preRoundedPoints[0], preRoundedPoints, radius)
  }
  preRoundedPoints.sort((a, b) => a.id - b.id)

  // final calc coordinates
  const roundedPoints: Linked<RoundedPoint>[] =
  preRoundedPoints.map((p, id) => {

    const
      bisLength = p.arc.radius / Math.sin(p.angle.main / 2),
      offset = p.arc.radius * p.angle.vel

    return {
      x: p.x,
      y: p.y,
      angle: p.angle,
      offset,
      arc: {
        radius: p.arc.radius,
        x: p.x + Math.cos(p.angle.bis) * bisLength,
        y: p.y + Math.sin(p.angle.bis) * bisLength,
      },
      in: {
        length: p.in.length,
        x: p.x + Math.cos(p.angle.prev) * offset,
        y: p.y + Math.sin(p.angle.prev) * offset,
      },
      out: {
        length: p.out.length,
        x: p.x + Math.cos(p.angle.next) * offset,
        y: p.y + Math.sin(p.angle.next) * offset,
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
  points: Linked<PreRoundedPoint>[],
  radius: number
) => {

  if (!curr.locked) {
    const prev = points.find((p) => p.id === (curr.id - 1 + points.length) % points.length)!
    const next = points.find((p) => p.id === (curr.id + 1) % points.length)!

    if (radius >= curr.arc.hit) {
      if (curr.arc.hit === next.arc.hit) {
        const _prev  = points.find((p) => p.id === (prev.id - 1 + points.length) % points.length)!
        const _next  = points.find((p) => p.id === (next.id + 1) % points.length)!
        const _nnext = points.find((p) => p.id === (_next.id + 1) % points.length)!

        curr.arc.radius = curr.arc.hit
        next.arc.radius = curr.arc.hit
        next.locked = true
        curr.locked = true
        i -= 2

        curr.offset = curr.arc.radius * curr.angle.vel
        next.offset = next.arc.radius * next.angle.vel

       _next.in.rest  -= next.offset
        next.out.rest -= next.offset
        next.in.rest  -= next.offset
        next.in.rest  -= curr.offset
        curr.out.rest -= curr.offset
        curr.in.rest  -= curr.offset
        prev.out.rest -= curr.offset

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
        const _next  = points.find((p) => p.id === (next.id + 1) % points.length)!
        const _prev  = points.find((p) => p.id === (prev.id - 1 + points.length) % points.length)!
        const _pprev = points.find((p) => p.id === (_prev.id - 1 + points.length) % points.length)!

        curr.arc.radius = curr.arc.hit
        prev.arc.radius = curr.arc.hit
        curr.locked = true
        prev.locked = true
        i -= 2

        curr.offset = curr.arc.radius * curr.angle.vel
        prev.offset = prev.arc.radius * prev.angle.vel

       _prev.out.rest -= prev.offset
        prev.in.rest  -= prev.offset
        prev.out.rest -= prev.offset
        prev.out.rest -= curr.offset
        curr.in.rest  -= curr.offset
        curr.out.rest -= curr.offset
        next.in.rest  -= curr.offset

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

        curr.offset = curr.arc.radius * curr.angle.vel

        prev.out.rest -= curr.offset
        curr.in.rest -= curr.offset
        curr.out.rest -= curr.offset
        next.in.rest -= curr.offset

        curr.locked = true
        i--
      }
    }
    else {
      curr.offset = curr.arc.radius * curr.angle.vel

      prev.out.rest -= curr.offset
      curr.in.rest -= curr.offset
      curr.out.rest -= curr.offset
      next.in.rest -= curr.offset

      curr.locked = true
      i--
    }
  }
}



const minArcHit = (
  a: Linked<PreRoundedPoint>, b: Linked<PreRoundedPoint>
) => {
  if (a.locked && !b.locked) return 1
  else if (!a.locked && b.locked) return -1
  else if (a.locked && b.locked) return 0
  else return a.arc.hit - b.arc.hit
}



export default roundPolygon