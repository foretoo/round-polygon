import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect, animate, text, font, settext } from "./bratik.js"
import { Polio } from "./Polio.js"
const { ctx, height, width } = getcanvas(), radius = Number.MAX_SAFE_INTEGER, mg = Math.min(width, height) / 3, fun = Object.assign({ image: "🏄" }, randtxt(mg / 2))
const verpoly = new Polio(9, radius, width + mg * 2, height + mg * 2)
verpoly.initgradient()
verpoly.update(8000)
const horpoly = new Polio(13, radius, width + mg, height + mg)
horpoly.initgradient()
ctx.shadowOffsetY = 20
font(64)
settext("center", "middle")
const play = () => {
  loop(() => {
    if (frame % 480 === 0) verpoly.update(8000)
    if ((frame - 320) % 480 === 0) horpoly.update(8000)
    if ((frame - 160) % 480 === 0) animate(8000)(fun, Object.assign({}, randtxt(mg / 2)))
    bg("black")
    verpoly.draw()
    ctx.drawImage(verpoly.image, -mg * 2, -mg * 2)
    lines(verpoly.points, mg)
    centres(verpoly.rounded, "white", mg)
    horpoly.draw()
    ctx.drawImage(horpoly.image, -mg, -mg)
    lines(horpoly.points, mg / 2)
    centres(horpoly.rounded, "black", mg / 2)
    ctx.shadowColor = "#0004"
    ctx.shadowBlur = 20
    text(fun.image, fun.x, fun.y)
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
  })
}
function bg(color) {
  fill(color)
  rect(0, 0, width, height)
}
function lines(points, mg) {
  stroke("#fff4", 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x - mg, p.y - mg))
  shape(CLOSE)
}
function centres(polygon, color, mg) {
  polygon.forEach((p) => {
    stroke(null)
    fill(color)
    circle(p.arc.x - mg, p.arc.y - mg, 3)
  })
}
function randtxt(mg) {
  return {
    x: mg + Math.random() * (width - mg * 2),
    y: mg + Math.random() * (height - mg * 2),
  }
}
document.onkeyup = ({ code }) => {
  code === "Space" && (looping ? stop() : play())
}
play()
