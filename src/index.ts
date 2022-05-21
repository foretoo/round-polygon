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



const minArcHit = (
  a: Linked<PreRoundedPoint>, b: Linked<PreRoundedPoint>
) => {
  if (a.locked && !b.locked) return 1
  else if (!a.locked && b.locked) return -1
  else if (a.locked && b.locked) return 0
  else return a.arc.hit - b.arc.hit
}



export default roundPolygon