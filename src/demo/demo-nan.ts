import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import {
  getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, arc, text, font, settext, loop
} from "bratik"
import roundPolygon from ".."

const
  { height, width } = getcanvas(),
  l = 50,
  ox = width/2 - l*2,
  oy = height/2 - l*2,
  f = 1e-5,
  grey = "#0007",
  skin = "#f407",
  highlight = "#e02",
  radiusrange = document.querySelector("input")!,
  radiusvalue = document.querySelector("#radiusvalue")!,
  points: InitPoint[] = [
    // { x: l*2+ox, y: oy },{ x: l*2+ox, y: l*2+oy },{ x: l*4+ox, y: l*2+oy },{ x: l*2+ox, y: l*2+oy },{ x: l*2+ox, y: l*4+oy },{ x: l*2+ox, y: l*2+oy },{ x: ox, y: l*2+oy },{ x: l*2+ox, y: l*2+oy },
    // { x: l*3+ox, y: oy },{ x: l*4+ox, y: oy },{ x: l*2+ox, y: oy },{ x: l*2+ox, y: l*2+oy },{ x: ox, y: l*2+oy },{ x: ox, y: oy },
    // { x: l+ox, y: oy },{ x: l*4+ox, y: oy },{ x: l*2+ox, y: oy },{ x: l*2+ox, y: l*2+oy },{ x: ox, y: l*2+oy },{ x: ox, y: oy },
    { x: l*2+ox, y: oy },{ x: l*4+ox, y: oy },{ x: l*2+ox, y: oy },{ x: l*2+ox, y: l*2+oy },{ x: ox, y: l*2+oy },{ x: ox, y: oy },
    // { x: ox, y: oy },{ x: l*4+ox, y: oy },{ x: l+ox, y: oy },{ x: l+ox, y: l*2+oy },{ x: l*3+ox, y: l*2+oy },{ x: l*3+ox, y: oy },
    // { x: l*4+ox, y: oy },{ x: ox, y: oy },{ x: ox, y: l*2+oy },{ x: l*2+ox, y: l*2+oy },{ x: l*2+ox, y: oy },
  ]

radiusrange.value = "1000"
radiusvalue.textContent = radiusrange.value
let polygon: RoundedPoint[]

// for (let i = 0; i < points.length; i++) if (i % 2 === 0) points[i].r = 0
polygon = roundPolygon(points, +radiusrange.value)
// polygon.forEach((p) => {
//   const {
//     id, offset, angle: { main },
//   } = p
//   console.log(`id-${id} angle-${main} offset-${offset}`)
// })


radiusrange.oninput = () => {
  radiusvalue.textContent = radiusrange.value
  polygon = roundPolygon(points, +radiusrange.value)
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

  fill(skin)
  stroke(null)
  shape()
  polygon.forEach((p, i) => {
    !i && vertex(p.in.x, p.in.y)
    p.arc.radius && arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius)
    vertex(p.next.in.x, p.next.in.y)
  })
  shape(CLOSE)

  polygon.forEach((p, i) => {

    //// Centers of roundings
    stroke(null)
    fill(highlight)
    circle(p.arc.x, p.arc.y, 2)

    //// Arcs of roundings, stroked
    if (p.arc.radius) {
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
    font(14, "monospace")
    settext("center", "middle")
    const { bis } = p.angle,
          x = p.x - Math.cos(bis) * 24,
          y = p.y - Math.sin(bis) * 24
    text(`${i}`, x, y)
  })
}

loop(draw)