import { Point, RoundedPoint } from "./types"

const PI = Math.PI

export const getSegments = (
  points: RoundedPoint[],
  type: "LENGTH" | "AMOUNT",
  opt: number
) => {

  if (!opt) return points

  return points.reduce((
    segmented: Point[], point
  ) => {

    const
      { angle: { prev, next }, arc: { x, y, radius }} = point,
      dir = point.angle.dir * -1,
      startangle = prev + dir * PI / 2,
      angle = (dir * PI + next - prev) % PI,
      amount = type === "LENGTH" ? Math.round(dir * angle * radius / opt) || 1 : opt,
      unitangle = angle / amount,
      vertices = []

    for (let i = 0; i <= amount; i++)
      vertices.push({
        x: x + Math.cos(startangle + unitangle * i) * radius,
        y: y + Math.sin(startangle + unitangle * i) * radius,
      })

    return segmented.concat(vertices)
  }, [])
}