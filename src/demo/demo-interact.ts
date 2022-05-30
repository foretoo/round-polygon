import "./style.sass"
import { Linked, InitPoint, RoundedPoint } from "../types"
import {
  getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, arc, text, font, settext, frame, loop, animate
} from "bratik"
import roundPolygon from ".."

const
  { canvas, ctx, height, width } = getcanvas(),
  grey = "#0007",
  skin = "#f407",
  highlight = "#e02",
  control = document.querySelector("label")!,
  radiusrange = document.querySelector("input")!,
  radiusvalue = document.querySelector("#radiusvalue")!,
  limradius = 10

control.classList.add("hidden")

let points: InitPoint[] = [
      // { x: 157, y: 210 },{ x: 265, y: 202 },{ x: 304, y: 363 },{ x: 100, y: 373 },{ x: 221, y: 501 },
      // { x: 230, y: 295 },{ x: 280, y: 172 },{ x: 112, y: 267 },{ x: 152, y: 493 },{ x: 339, y: 447 },
      // { x: 280, y: 172 },{ x: 112, y: 267 },{ x: 152, y: 493 },{ x: 339, y: 447 },{ x: 112, y: 370 },
      // { x: 218, y: 420 },{ x: 415, y: 287 },{ x: 252, y: 314 },{ x: 135, y: 126 },{ x: 142, y: 414 },
      // { x: 165, y: 502 },{ x: 345, y: 417 },{ x: 351, y: 277 },{ x: 238, y: 261 },{ x: 214, y: 65 },
      { x: 265, y: 396 },{ x: 239, y: 204 },{ x: 132, y: 435 },{ x: 309, y: 543 },{ x: 412, y: 163 },
    ],
    polygon: Linked<RoundedPoint>[]

for (let i = 0; i < points.length; i++) {
  points[i].r = limradius * (i + 1)
  !i && (points[i].r = Number.MAX_SAFE_INTEGER)
}
polygon = roundPolygon(points)



let activePoint: InitPoint | undefined,
    grabbingPoint: InitPoint | undefined,
    searchPoint: InitPoint | undefined,
    activeid: number,
    searchid: number,
    px: number,
    py: number

canvas.onpointermove = (e: PointerEvent) => {

  px = e.offsetX
  py = e.offsetY

  searchid = points.findIndex((p) => (
    p.x - 10 <= px && px <= p.x + 10 &&
    p.y - 10 <= py && py <= p.y + 10
  ))
  searchPoint = points[searchid]

  if (searchPoint && !canvas.classList.contains("add")) canvas.classList.add("grab")
  else canvas.classList.remove("grab")
  
  if (grabbingPoint) {
    grabbingPoint.x = px
    grabbingPoint.y = py
    polygon = roundPolygon(points)
  }
}
canvas.onpointerdown = (e: PointerEvent) => {
  e.preventDefault()

  grabbingPoint = activePoint = searchPoint
  if (grabbingPoint) canvas.classList.add("grabbing")
  if (activePoint) {
    activeid = searchid
    control.classList.remove("hidden")
    radiusrange.value = points[searchid].r!.toString()
    radiusvalue.textContent = printradius()
  }
  else {
    control.classList.add("hidden")
  }
}
canvas.onpointerup = () => {
  grabbingPoint = undefined
  canvas.classList.remove("grabbing")
}



radiusrange.oninput = (e: Event) => {
  printradius()
  const target = e.target as HTMLInputElement
  points[activeid].r = +target.value
  polygon = roundPolygon(points)
}
const printradius = () => radiusvalue.textContent = `${activeid} radius = ${radiusrange.value}`
printradius()



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
    if (!i) vertex(p.in.x, p.in.y);
    arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius);
    vertex(p.next.in.x, p.next.in.y);
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
    arc(p.x, p.y, p.out.x, p.out.y, p.arc.radius);
    shape()

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

  if (searchPoint) {
    fill(highlight)
    stroke(null)
    circle(searchPoint.x, searchPoint.y, 6)
  }
  if (activePoint) {
    fill(highlight)
    stroke(skin, 8)
    circle(activePoint.x, activePoint.y, 6)
  }
}

loop(draw)