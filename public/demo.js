import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, arc, text, font, settext, frame, loop, animate } from "https://unpkg.com/bratik@0.3.7/dist/bratik.es.js"
import roundPolygon from "../lib/round-polygon.es.js"

const
  { ctx, height, width } = getcanvas(),
  pointnum = 6,
  grey = "#0007",
  skin = "#f407",
  highlight = "#e02",
  padding = -Math.min(width, height) / 10,
  radiusrange = document.querySelector("input"),
  radiusvalue = document.querySelector("#radiusvalue")

ctx.lineCap = "round"
ctx.lineJoin = "round"

let points = [], polygon
for (let i = 0; i < pointnum; i++) points[i] = { x: width / 2, y: height / 2 }
polygon = roundPolygon(points, +radiusrange.value)
draw()

const animatepoint = (p) => {
  const
    moveX = animate(8000, "cubicInOut"),
    moveY = animate(8000, "cubicInOut"),
    newpoint = getrandpoint()

  moveX(p, { x: newpoint.x })
  moveY(p, { y: newpoint.y })
}
points.forEach(animatepoint)

const play = () => {
  if (frame % 480 === 0) points.forEach(animatepoint)
  polygon = roundPolygon(points, +radiusrange.value)
  draw()
}
loop(play)

radiusvalue.textContent = radiusrange.value
radiusrange.oninput = (e) => {
  const target = e.target
  radiusvalue.textContent = target.value
  polygon = roundPolygon(points, +radiusrange.value)
  draw()
}

function draw() {
  clear()
  stroke(grey, 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)
  stroke(null)
  fill(grey)
  points.forEach((p) => circle(p.x, p.y, 1))
  if (points.length > 2) {
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
      const { bis } = p.angle, x = p.x - Math.cos(bis) * 24, y = p.y - Math.sin(bis) * 24
      text(`${i}`, x, y)
    })
  }
}

function getrandpoint() {
  return {
    x: padding + Math.random() * (width - padding * 2),
    y: padding + Math.random() * (height - padding * 2),
  }
}
