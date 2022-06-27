import { Point, RoundedPoint } from "./types"

const PI = Math.PI
const getSegments = (
  points: RoundedPoint[],
  type: "LENGTH" | "AMOUNT",
  opt: number
) => {

  if (!opt) return points.map((p) => ({ x: p.x, y: p.y }))

  const formedPolygon = points.reduce((
    acc: Point[], point
  ) => {

    const
      { angle: { prev, next }, arc: { x, y, radius }} = point,
      dir = point.angle.dir * -1,
      startangle = prev + dir * PI / 2,
      angle = (dir * PI + next - prev) % PI,
      amount = type === "LENGTH" ? Math.round(dir * angle * radius / opt) || 1 : opt,
      unitangle = angle / amount,
      segments = []

    for (let i = 0; i <= amount; i++) {
      segments.push({
        x: x + Math.cos(startangle + unitangle * i) * radius,
        y: y + Math.sin(startangle + unitangle * i) * radius,
      })
    }

    return acc.concat(segments)
  }, [])

  return formedPolygon
}

export {
  getSegments
}