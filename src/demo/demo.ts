import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect, animate, text, font, settext } from "bratik"
import { Polio } from "./Polio"


const
  { ctx, height, width } = getcanvas(),
  radius = Number.MAX_SAFE_INTEGER,
  mg = Math.min(width, height) / 3,
  control = document.querySelector("label")!,
  color = [ "#7fa", "#a7f", "#fa7" ],
  helly = {
    image: "🏄",
    ...randtxt(100)
  }

control.classList.add("hidden")



const verpoly = new Polio(9, radius, width + mg * 2, height + mg * 2)
verpoly.initgradient()
verpoly.update(8000)

const horpoly = new Polio(13, radius, width + mg, height + mg)
horpoly.initgradient()

// const keypoly = new Polio(4, radius, width - mg, height - mg)
// keypoly.color(color[3])
ctx.shadowOffsetY = 20
font(64)
settext("center", "middle")



const play = () => {
  loop(() => {
    if (frame % 480 === 0) verpoly.update(8000)
    if ((frame - 320) % 480 === 0) horpoly.update(8000)
    if ((frame - 160) % 480 === 0) {
      const fly = animate(8000)
      fly(helly, { ...randtxt(100) })
    }

    bg("black")

    verpoly.draw()
    ctx.drawImage(verpoly.image, -mg * 2, -mg * 2)
    lines(verpoly.points, mg)
    centres(verpoly.rounded, "white", mg)

    horpoly.draw()
    ctx.drawImage(horpoly.image, -mg, -mg)
    lines(horpoly.points, mg / 2)
    centres(horpoly.rounded, "black", mg / 2)

    // keypoly.draw()
    // ctx.drawImage(keypoly.image, mg, mg)

    ctx.shadowColor = "#0004"
    ctx.shadowBlur = 20
    text(helly.image, helly.x, helly.y)
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
  })
}

function bg(color: string) {
  fill(color)
  rect(0, 0, width, height)
}

function lines(points: InitPoint[], mg: number) {
  stroke("#fff4", 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x - mg, p.y - mg))
  shape(CLOSE)
}

function centres(polygon: RoundedPoint[], color: string, mg: number) {
  polygon.forEach((p) => {
    stroke(null)
    fill(color)
    circle(p.arc.x - mg, p.arc.y - mg, 3)
  })
}

function randtxt(mg: number) {
  return {
    x: mg + Math.random() * (width - mg * 2),
    y: mg + Math.random() * (height - mg * 2)
  }
}

document.onkeyup = ({ code }) => {
  code === "Space" && (looping ? stop() : play())
}

play()