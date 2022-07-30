import { Point, RoundedPoint } from "./types"

const PI = Math.PI

export const getSegments = (
  points: RoundedPoint[],
  type: "LENGTH" | "AMOUNT",
  opt: number
) => (

  points.reduce((
    segmented: Point[], point
  ) => {

    const
      { x, y, angle: { prev, next }, arc: { x: rx, y: ry, radius }} = point,
      dir = point.angle.dir * -1,
      startangle = prev + dir * PI / 2,
      angle = (dir * PI + next - prev) % PI,
      amount = type === "LENGTH" ? Math.round(dir * angle * radius / opt) : opt,
      unitangle = angle / amount,
      vertices: Point[] = []

    if (!amount || !unitangle) return segmented.concat({ x, y })

    for (let i = 0; i <= amount; i++)
      vertices.push({
        x: rx + Math.cos(startangle + unitangle * i) * radius,
        y: ry + Math.sin(startangle + unitangle * i) * radius,
      })

    return segmented.concat(vertices)
  }, [])
)