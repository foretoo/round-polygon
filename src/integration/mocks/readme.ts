import { InitPoint, RoundedPoint } from "../../types"
import { getcanvas, shape, vertex, arc, CLOSE, fill, stroke, text, font, settext, circle, rect, animate, bg } from "bratik"
import roundPolygon from "../.."

const
  { ctx, height, width } = getcanvas(800, 200),
  min = Math.min(width, height) / 2,
  grey = "#0003",
  skin = "#04f7",
  highlight = "#02e",
  points: InitPoint[][] = Array(4).fill(null).map((_, i) => {
    return Array(6).fill(null).map((_, j) => {
      const
        cx = min + i * min * 2,
        cy = min,
        l = Math.random() * min / 4 * 3,
        a = (Math.PI * 2 / 7) * j + Math.random() * (Math.PI * 2 / 7)
  
      return {
        x: cx + Math.cos(a) * (l + min / 4),
        y: cy + Math.sin(a) * (l + min / 4),
      }
    })
  })

let polygon: RoundedPoint[]

export const draw = () => {
  bg("white")

  points.forEach((poly) => {
    stroke(grey, 1)
    fill(null)
    shape()
    poly.forEach((p) => vertex(p.x, p.y))
    shape(CLOSE)

    polygon = roundPolygon(poly, 1000)
    fill(skin)
    stroke(highlight, 2)
    shape()
    polygon.forEach((p) => {
      vertex(p.in.x, p.in.y)
      arc(p.x, p.y, p.next.x, p.next.y, p.arc.radius)
    })
    shape(CLOSE)
  })
}