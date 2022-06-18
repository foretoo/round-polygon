import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect, pxratio } from "https://unpkg.com/bratik@latest/lib/bratik.es.js"
import { Polio } from "./Polio.js"
const { ctx, canvas, height, width } = getcanvas(), radius = Number.MAX_SAFE_INTEGER, min = Math.min(width, height), initscale = 1.25, control = document.querySelector("label"), color = [ "#7fa", "#a7f", "#fa7" ]
const verpoly = new Polio(9, radius, initscale, width, height, 8000)
verpoly.initgradient()
verpoly.init()
const horpoly = new Polio(7, radius, initscale * 0.8, width, height, 8000)
horpoly.initgradient()
const keypoly = new Polio(4, radius, initscale * 0.6, width, height, 8000)
keypoly.color(color[0])
const play = () => {
  if (frame === 160)
    horpoly.init()
  if (frame === 320)
    keypoly.init()
  bg("white")

  verpoly.draw()
  ctx.drawImage(verpoly.image, 0, 0)
  vertices(verpoly.points, "black")
  horpoly.draw()
  ctx.drawImage(horpoly.image, 0, 0)
  vertices(horpoly.points, "lightgrey")
  keypoly.draw()
  ctx.drawImage(keypoly.image, 0, 0)
  vertices(keypoly.points, color[0])
  fill(null)
  stroke("#0004", 0.5)
  circle(width / 2, height / 2, min / 2 * initscale)
  circle(width / 2, height / 2, min / 2 * initscale * 0.8)
  circle(width / 2, height / 2, min / 2 * initscale * 0.6)
}
function bg(color) {
  fill(color)
  rect(0, 0, width, height)
}
function lines(points) {
  stroke("#0004", 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)
}
function vertices(points, color) {
  stroke(null)
  fill(color)
  points.forEach((p) => circle(p.x, p.y, 3))
}
function centres(polygon, color) {
  polygon.forEach((p) => {
    stroke(null)
    fill(color)
    circle(p.arc.x, p.arc.y, 3)
  })
}
const globepauseplay = () => {
  if (looping) {
    stop()
    verpoly.pause()
    horpoly.pause()
    keypoly.pause()
  }
  else {
    loop(play)
    verpoly.play()
    horpoly.play()
    keypoly.play()
  }
}
const pausehandle = (e) => {
  if (e instanceof KeyboardEvent && e.code === "Space" ||
        e instanceof MouseEvent && e.button === 0) {
    globepauseplay()
  }
}
canvas.onpointerdown = canvas.onkeydown = pausehandle
loop(play)
