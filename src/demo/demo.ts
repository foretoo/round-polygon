import "./style.sass"
import { Linked, RoundedPoint } from "../types"
import { assignValue } from "../utils"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, Point, arc, text, font, settext, PI } from "bratik"
import roundPolygon from ".."

const { canvas } = getcanvas(),
      points: Point[] = [],
      grey = "#0007",
      bluish = "#00f7"
      
let polygon: Linked<RoundedPoint>[]


canvas.onpointerdown = (e: PointerEvent) => {
  const point = { x: e.pageX, y: e.pageY }
  assignValue(point, points, 5)
  polygon = roundPolygon(points, +radiusrange.value)
  draw()
}
const radiusrange = document.querySelector("input")!
const radiusvalue = document.querySelector("#radiusvalue")!
radiusvalue.textContent = radiusrange.value
radiusrange.oninput = (e: Event) => {
  const target = e.target as HTMLInputElement
  radiusvalue.textContent = target.value
  polygon = roundPolygon(points, +radiusrange.value)
  draw()
}


const draw = () => {
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
    fill(bluish)
    stroke("blue", 1)
    shape()
    polygon.forEach((p, i) => {
      if (!i) vertex(p.in.x, p.in.y);
      arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius);
      vertex(p.next.in.x, p.next.in.y);
    })
    shape(CLOSE)

    polygon.forEach((p, i) => {

      //// Centers of roundings
      stroke(null)
      fill("blue")
      circle(p.arc.x, p.arc.y, 3)

      //// Arcs of roundings, stroked
      fill(null)
      stroke("black", 3)
      shape()
      vertex(p.in.x, p.in.y)
      arc(p.x, p.y, p.out.x, p.out.y, p.arc.radius);
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
    })
  }
}