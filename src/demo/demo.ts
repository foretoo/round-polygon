import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect, animate, text, font, settext, line, TAU, pxratio } from "bratik"
import { Polio } from "./Polio"



const
  { ctx, canvas, height, width } = getcanvas(512),
  radius = Number.MAX_SAFE_INTEGER,
  min = Math.min(width, height),
  sc = 1.25,
  color = [ "#7fa", "#a7f", "#fa7" ]



const verpoly = new Polio(ctx, 9, radius, sc, width, height, 8000)
verpoly.initgradient()
verpoly.init()

const horpoly = new Polio(ctx, 7, radius, sc * 0.8, width, height, 8000)
horpoly.initgradient()

const keypoly = new Polio(ctx, 4, radius, sc * 0.6, width, height, 8000)
keypoly.color(color[0])



const play = () => {
  
  if (frame === 160) horpoly.init()
  if (frame === 320) keypoly.init()

  bg("black")

  fill(null)
  stroke("#fff4", 0.5)
  circle(width/2, height/2, min/2*sc)
  verpoly.draw()
  // lines(verpoly.points)
  // centres(verpoly.rounded, "white")
  vertices(verpoly.points, "#555")

  fill(null)
  stroke("#fff4", 0.5)
  circle(width/2, height/2, min/2*sc*0.8)
  horpoly.draw()
  lines(horpoly.points, "#fff4")
  // centres(horpoly.rounded, "black")
  vertices(horpoly.points, "#aaa")

  fill(null)
  stroke("#fff4", 0.5)
  circle(width/2, height/2, min/2*sc*0.6)
  keypoly.draw()
  // lines(keypoly.points, "#7fa7")
  vertices(keypoly.points, color[0])
}

function bg(color: string) {
  fill(color)
  rect(0, 0, width, height)
}

function lines(points: InitPoint[], color: string) {
  stroke(color, 1)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)
}

function vertices(points: InitPoint[], color: string) {
  stroke(null)
  fill(color)
  points.forEach((p) => circle(p.x, p.y, 3))
}

function centres(polygon: RoundedPoint[], color: string) {
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

const pausehandle = (e: KeyboardEvent | MouseEvent) => {
  if (
    e instanceof KeyboardEvent && e.code === "Space" ||
    e instanceof MouseEvent && e.button === 0
  ) {
    globepauseplay()
  }
}
canvas.onpointerdown = window.onkeydown = pausehandle

loop(play)