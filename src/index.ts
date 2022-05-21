import { Point, Linked, PreRoundedPoint, RoundedPoint } from "./types"
import { getLength, getAngles, getNext, getPrev } from "./utils"



const roundPolygon = (
  points: Point[], radius: number
): Linked<RoundedPoint>[] => {

  const preRoundedPoints: PreRoundedPoint[] =
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
      locked: false
    }
  })

  const linkedPreRoundedPoints = preRoundedPoints.reduce((
    shape: Linked<PreRoundedPoint>[], p: PreRoundedPoint, id: number
  ) => {
    const curr = {
      ...p,
      id,
      get prev() { return getPrev(id, shape) },
      get next() { return getNext(id, shape) },
    }
    curr.arc.hit = Math.min(
      p.out.length / (curr.angle.vel + curr.next.angle.vel),
      p.in.length  / (curr.angle.vel + curr.prev.angle.vel),
    )
    return shape.concat(curr)
  }, [])

  const roundedPoints = linkedPreRoundedPoints.reduce(finSet, [])

  return roundedPoints
}



const finSet = (
  shape: Linked<RoundedPoint>[], p: Linked<PreRoundedPoint>, id: number
) => {

  const
    bisLength = p.arc.radius / Math.sin(p.angle.main / 2),
    offset = p.arc.radius * p.angle.vel,
    point: Linked<RoundedPoint> = {
      id,
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
      get prev() { return getPrev(id, shape) },
      get next() { return getNext(id, shape) },
    }

  return shape.concat(point)
}



export default roundPolygon