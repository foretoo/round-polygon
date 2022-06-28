import "../demo/style.sass"
import { InitPoint, RoundedPoint } from "../types"
import {
  getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, text, font, settext, loop
} from "bratik"
import roundPolygon from ".."
import { getSegments } from "../segments"

const
  { height, width } = getcanvas(),
  l = 50,
  ox = width/2  - l*2,
  oy = height/2 - l*2,
  grey = "#fffa",
  skin = "#7af7",
  highlight = "#4af",
  radiusrange = document.querySelector("input")!,
  radiusvalue = document.querySelector("#radiusvalue")!,
  points: InitPoint[] = [
    { x: l*5+ox,  y: l*2+oy },
    { x: l*3+ox,  y: oy     },
    { x: l*3+ox,  y: l*4+oy },
    { x: ox-l,    y: l*4+oy },
  ]//.reverse()

radiusrange.value = "25"
radiusrange.max = "100"
radiusvalue.textContent = radiusrange.value
let polygon: RoundedPoint[],
    formedPolygon: { x: number, y: number }[]



polygon = roundPolygon(points, +radiusrange.value)
formedPolygon = getSegments(polygon, "LENGTH", 10)



function draw() {
  clear()

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
  formedPolygon = getSegments(polygon, "LENGTH", 4)
  draw()
}
draw()