import "./style.sass"
import { InitPoint } from "../types"
import { getcanvas, shape, vertex, arc, CLOSE, fill, stroke, text, font, settext, circle, rect } from "bratik"
import roundPolygon from ".."

document.querySelector("label")!.classList.add("hidden")

const
  { height, width } = getcanvas(960, 280),
  grey = "#000d",
  skin = "#04f7",
  highlight = "#02e",
  points: InitPoint[] = [
    { x: 100, y:   0 },
    { x:   0, y: 150 },
    { x: 200, y: 150 },
    { x: 200, y:   0 },
    { x: 150, y: 200 },
  ],
  oy = 40

font(16, "monospace")
settext("center", "middle")
fill("#fff")
stroke(null)
rect(0, 0, width, height)
let ox: number, radius: number

for (let i = 0; i < 4; i++) {

  ox = i * 230 + 40
  ox = (i === 2 || i === 3) ? ox - 25 : ox
  radius = !i ? 0 : i === 1 ? 15.99 : 1000

  if (i === 3) {
    points[0].r = 50
    points[2].r = 60
  }

  const polygon = roundPolygon(points, radius)

  fill(skin)
  stroke(highlight, 2)
  shape()
  polygon.forEach((p) => {
    vertex(p.in.x + ox, p.in.y + oy)
    arc(p.x + ox, p.y + oy, p.next.x + ox, p.next.y + oy, p.arc.radius)
  })
  shape(CLOSE)

  stroke(null)
  fill(grey)
  text(
    `radius=${Math.round(radius)}`,
    (i === 1 || i === 2) ? 100 + ox : 60 + ox,
    210
  )

  if (i === 3) {
    fill(null)
    stroke("#0003", 1)
    shape()
    points.forEach((p) => vertex(p.x + ox, p.y + oy))
    shape(CLOSE)

    polygon.forEach((p) => {
      if (p.id === 0 || p.id === 2) {
        stroke(null)
        fill(grey)
        circle(p.x + ox, p.y + oy, 4)
        text(
          `r=${p.arc.radius}`,
          p.x + ox - Math.cos(p.angle.bis) * 15,
          p.y + oy + 20 * (!p.id ? -1 : 1)
        )
      }
    })
  }

  if (!i) {
    stroke(null)
    fill(grey)
    polygon.forEach((p) => {
      text(
        `${p.id}`,
        p.x + ox - Math.cos(p.angle.bis) * 15,
        p.y + oy - Math.sin(p.angle.bis) * 15
      )
    })
  }
}