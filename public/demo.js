import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect } from "https://unpkg.com/bratik@latest/lib/bratik.es.js"
import { Polio } from "./Polio.js"
const { ctx, canvas, height, width } = getcanvas(), radius = Number.MAX_SAFE_INTEGER, min = Math.min(width, height), sc = 1.25, color = [ "#7fa", "#a7f", "#fa7" ]
const verpoly = new Polio(ctx, 9, radius, sc, width, height, 8000)
verpoly.gradient()
verpoly.init()
const horpoly = new Polio(ctx, 7, radius, sc * 0.8, width, height, 8000)
horpoly.gradient()
const keypoly = new Polio(ctx, 4, radius, sc * 0.6, width, height, 8000)
keypoly.color(color[0])
const play = () => {
  if (frame === 160) horpoly.init()
  if (frame === 320) keypoly.init()
  bg("black")
  fill(null)
  stroke("#fff4", 0.5)
  circle(width / 2, height / 2, min / 2 * sc)
  verpoly.draw()
  vertices(verpoly.points, "#555")
  fill(null)
  stroke("#fff4", 0.5)
  circle(width / 2, height / 2, min / 2 * sc * 0.8)
  horpoly.draw()
  lines(horpoly.points, "#fff4")
  vertices(horpoly.points, "#aaa")
  fill(null)
  stroke("#fff4", 0.5)
  circle(width / 2, height / 2, min / 2 * sc * 0.6)
  keypoly.draw()
  vertices(keypoly.points, color[0])
}
function bg(color) {
  fill(color)
  rect(0, 0, width, height)
}
function lines(points, color) {
  stroke(color, 1)
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
const globepauseplay = () => {
  if (looping) {
    stop()
    verpoly.updater.pause()
    horpoly.updater.pause()
    keypoly.updater.pause()
  }
  else {
    loop(play)
    verpoly.updater.paused && verpoly.updater.play()
    horpoly.updater.paused && horpoly.updater.play()
    keypoly.updater.paused && keypoly.updater.play()
  }
}
const pausehandle = (e) => {
  if (e instanceof KeyboardEvent && e.code === "Space" || e instanceof MouseEvent && e.button === 0) globepauseplay()
}
canvas.onpointerdown = window.onkeydown = pausehandle
document.onvisibilitychange = globepauseplay
loop(play)
