import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, arc, text, font, settext, frame, loop, animate, pxratio } from "bratik"
import roundPolygon from ".."

const
  { canvas, ctx, height, width } = getcanvas(),
  pointnum = 6,
  grey = "#0007",
  skin = "#f407",
  highlight = "#e02",
  padding = 0, // Math.min(width, height) / 10,
  radiusrange = document.querySelector("input")!,
  radiusvalue = document.querySelector("#radiusvalue")!,
  limradius = 10

let points: InitPoint[] = [],
    polygon: RoundedPoint[]



const getrandpoint = () => ({
  x: padding + Math.random() * (width - padding * 2),
  y: padding + Math.random() * (height - padding * 2),
})

const animatepoint = (p: InitPoint, i: number) => {
  const move = animate(8000, "cubicInOut")
  const newpoint = getrandpoint()
  if (i % 2 !== 0) points[i].r = limradius * i
  move(p, { x: newpoint.x, y: newpoint.y })
}

for (let i = 0; i < pointnum; i++) {
  points[i] = getrandpoint()
  if (!i) points[i].r = 0
  else if (i % 2 !== 0) points[i].r = limradius * i
}
points.forEach(animatepoint)

loop(() => {
  if (frame % 480 === 0) points.forEach(animatepoint)
  polygon = roundPolygon(points, +radiusrange.value)
  draw()
})




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
  fill("black")
  settext("left", "middle")
  text(legendText, x + 20, y)
}


radiusrange.oninput = () => printradius()
const printradius = () => radiusvalue.textContent = `common radius = ${radiusrange.value}`
printradius()


function draw() {
  clear()
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
    if (!i) vertex(p.in.x, p.in.y)
    arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius)
    vertex(p.next.in.x, p.next.in.y)
  })
  shape(CLOSE)

  polygon.forEach((p, i) => {

    //// Centers of roundings
    stroke(null)
    fill(highlight)
    circle(p.arc.x, p.arc.y, 3)

    //// Arcs of roundings, stroked
    fill(null)
    stroke(highlight, 4)
    shape()
    vertex(p.in.x, p.in.y)
    arc(p.x, p.y, p.out.x, p.out.y, p.arc.radius)
    shape()

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