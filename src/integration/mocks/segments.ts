import { InitPoint, RoundedPoint } from "../../types"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, text, font, settext, pxratio } from "bratik"
import roundPolygon from "../.."
import { getSegments } from "../../segments"
import { radiusrange, radiusvalue } from "./inputs"

const
  { ctx, height, width } = getcanvas(),
  pr = pxratio(),
  l = 100,
  grey = "#fffa",
  skin = "#7af7",
  highlight = "#4af",
  segopt = l / 2,
  segtype = "LENGTH",
  points: InitPoint[] = [
    { x: 0, y: 0 },
    { x: l, y: 0 },
    { x: l, y: l },
    { x: 0, y: l },
  ]


radiusrange.value = "25"
radiusrange.max = "100"
radiusvalue.textContent = radiusrange.value
let polygon: RoundedPoint[],
    formedPolygon: { x: number, y: number }[]



polygon = roundPolygon(points, +radiusrange.value)
formedPolygon = getSegments(polygon, segtype, segopt)



export function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  clear()
  ctx.translate((width / 2 - l / 2) * pr, (height / 2 - l / 2) * pr)

  //// Rounded fill
  fill(skin)
  stroke("#0000", 2)
  shape()
  formedPolygon.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)

  //// Segments points
  stroke(null)
  fill(highlight)
  formedPolygon.forEach((p) => circle(p.x, p.y, 1))

  //// Points numbers
  polygon.forEach((p, i) => {
    stroke(null)
    fill(grey)
    font(14, "monospace")
    settext("center", "middle")
    const { bis } = p.angle,
          x = p.x - Math.cos(bis) * 24,
          y = p.y - Math.sin(bis) * 24
    text(`${i}`, x, y)
  })
}

radiusrange.oninput = () => {
  radiusvalue.textContent = radiusrange.value
  polygon = roundPolygon(points, +radiusrange.value)
  formedPolygon = getSegments(polygon, segtype, segopt)
  draw()
}