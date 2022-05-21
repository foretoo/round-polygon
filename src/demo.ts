import "./style.sass"
import { Linked, RoundedPoint } from "./types"
import { assignValue } from "./utils"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, Point, arc, text, font, settext, PI } from "bratik"
import roundPolygon from "."

const { canvas } = getcanvas(),
      points: Point[] = [
        // { x: 157, y: 210 },{ x: 265, y: 202 },{ x: 304, y: 363 },{ x: 100, y: 373 },{ x: 221, y: 501 },
        // { x: 230, y: 295 },{ x: 280, y: 172 },{ x: 112, y: 267 },{ x: 152, y: 493 },{ x: 339, y: 447 },
        // { x: 280, y: 172 },{ x: 112, y: 267 },{ x: 152, y: 493 },{ x: 339, y: 447 },{ x: 112, y: 370 },
        // { x: 218, y: 420 },{ x: 415, y: 287 },{ x: 252, y: 314 },{ x: 135, y: 126 },{ x: 142, y: 414 },
        // { x: 165, y: 502 },{ x: 345, y: 417 },{ x: 351, y: 277 },{ x: 238, y: 261 },{ x: 214, y: 65 },
        // { x: 265, y: 396 },{ x: 239, y: 204 },{ x: 132, y: 435 },{ x: 309, y: 543 },{ x: 412, y: 163 },
      ],
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

      font(10)
      const inx = x - Math.cos(bis + PI / 2) * 24,
            iny = y - Math.sin(bis + PI / 2) * 24
      text(`in`, inx, iny)
      const outx = x - Math.cos(bis - PI / 2) * 24,
            outy = y - Math.sin(bis - PI / 2) * 24
      text(`out`, outx, outy)
    })
  }
}