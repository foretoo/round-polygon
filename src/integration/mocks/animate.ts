import { InitPoint, RoundedPoint } from "../../types"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, arc, text, font, settext, frame, animate, pxratio, bg } from "bratik"
import roundPolygon from "../.."
import { radiusrange, radiusvalue } from "./inputs"

const
  { ctx, height, width } = getcanvas(),
  pointnum = 6,
  grey = "#fffa",
  skin = "#7af7",
  highlight = "#4af",
  padding = 0,
  limradius = 10



let points: InitPoint[] = [],
    polygon: RoundedPoint[]



const getrandpoint = () => ({
  x: padding + Math.random() * (width - padding * 2),
  y: padding + Math.random() * (height - padding * 2),
})

for (let i = 0; i < pointnum; i++) {
  points[i] = getrandpoint()
  if (i % 2 !== 0) points[i].r = limradius * i
}
const move = animate({
  dur: 8000,
  ease: "cubicInOut",
  onend: () => {
    const newpoints = points.map(getrandpoint)
    move.on(points, newpoints)
  }
})
const newpoints = points.map(getrandpoint)
move.on(points, newpoints)



font(14, "monospace")
const
  legendText = `points with own radius — i * ${limradius}`,
  legendWidth = Math.ceil(ctx.measureText(legendText).width),
  pr = pxratio()

function legend() {
  const
    y = height - 60,
    x = (width - legendWidth / pr) / 2 - 20

  fill(null)
  stroke(highlight, 2)
  circle(x, y, 10)

  stroke(null)
  fill(grey)
  settext("left", "middle")
  text(legendText, x + 20, y)
}


radiusrange.oninput = () => printradius()
const printradius = () => radiusvalue.textContent = `common radius = ${radiusrange.value}`
printradius()


export function draw() {
  polygon = roundPolygon(points, +radiusrange.value)

  bg("#111")
  legend()

  stroke(grey, 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)

  stroke(null)
  fill(grey)
  points.forEach((p) => circle(p.x, p.y, 1))

  fill(skin)
  stroke(null)
  shape()
  polygon.forEach((p, i) => {
    !i && vertex(p.in.x, p.in.y)
    p.angle.main > 3e-4 && arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius)
    vertex(p.next.in.x, p.next.in.y)
  })
  shape(CLOSE)

  polygon.forEach((p, i) => {

    //// Centers of roundings
    stroke(null)
    fill(highlight)
    circle(p.arc.x, p.arc.y, 3)

    //// Arcs of roundings, stroked
    if (p.angle.main > 3e-4) {
      fill(null)
      stroke(highlight, 2)
      shape()
      vertex(p.in.x, p.in.y)
      arc(p.x, p.y, p.out.x, p.out.y, p.arc.radius)
      shape()
    }

    //// Points numbers
    stroke(null)
    fill(grey)
    font(14)
    settext("center", "middle")
    const { bis } = p.angle,
      x = p.x - Math.cos(bis) * 24,
      y = p.y - Math.sin(bis) * 24
    text(`${i}`, x, y)

    if (i % 2 !== 0) {
      fill(null)
      stroke(highlight, 2)
      circle(x, y, 10)
    }
  })
}