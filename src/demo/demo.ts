import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import { getcanvas, circle, shape, vertex, CLOSE, clear, fill, stroke, frame, loop, animate, stop, pxratio, looping } from "bratik"
import roundPolygon from ".."
import SimplexNoise from "simplex-noise"

const
  simplex = new SimplexNoise(),
  { ctx, height, width } = getcanvas(),
  pr = pxratio(),
  grey = "#0004",
  padding = -Math.min(width, height) / 4,
  pointnum = 13,
  radius = Number.MAX_SAFE_INTEGER,
  control = document.querySelector("label")!,
  vergradient = initgradient(),
  horgradient = initgradient()

control.classList.add("hidden")

let verpoints: InitPoint[] = [],
    horpoints: InitPoint[] = [],
    verpolygon: RoundedPoint[],
    horpolygon: RoundedPoint[]



initPolio(verpoints, 5, true)
initPolio(horpoints, 13)

function initPolio(polio: InitPoint[], num: number, instantly?: boolean) {
  for (let i = 0; i < num; i++) polio[i] = getrandpoint()
  instantly && polio.forEach(animatepoint)
}

function animatepoint(p: InitPoint) {
  const move = animate(8000, "cubicInOut")
  const newp = getrandpoint()
  move(p, { x: newp.x, y: newp.y })
}

function getrandpoint() {
  return {
    x: padding + Math.random() * (width - padding * 2),
    y: padding + Math.random() * (height - padding * 2),
  }
}

const play = () => {
  loop(() => {
    if (frame % 480 === 0) {
      verpoints.forEach(animatepoint)
    }
    if ((frame - 240) % 480 === 0) {
      horpoints.forEach(animatepoint)
    }
    verpolygon = roundPolygon(verpoints, radius)
    horpolygon = roundPolygon(horpoints, radius)
    draw()
  })
}



const { el: verbg, dr: verdraw } = getbg(vergradient, width, height, pr)
const { el: horbg, dr: hordraw } = getbg(horgradient, width, height, pr, true)



// ctx.globalCompositeOperation = "difference"
function draw() {
  clear()
  hordraw(horpolygon)
  verdraw(verpolygon)

  ctx.drawImage(horbg, 0, 0)
  lines(horpoints, grey)
  centres(horpolygon, "white")

  ctx.drawImage(verbg, 0, 0)
  lines(verpoints, grey)
  centres(verpolygon, "black")
}

function lines(points: InitPoint[], color: string) {
  stroke(color, 0.5)
  fill(null)
  shape()
  points.forEach((p) => vertex(p.x, p.y))
  shape(CLOSE)
}

function centres(polygon: RoundedPoint[], color: string) {
  polygon.forEach((p) => {
    stroke(null)
    fill(color)
    circle(p.arc.x, p.arc.y, 3)
  })
}

function noise(x: number, y: number) {
  return ( simplex.noise2D(x, y) + 1 ) / 2
}

type Mapper<T> = (value: unknown, index: number) => T
function newarr<T>(length: number, mapper: T | Mapper<T>): T[] {
  return Object.prototype.toString.call(mapper) === "[object Function]"
  ? Array(length).fill(null).map(mapper as Mapper<T>)
  : Array(length).fill(mapper)
}

function initgradient() {
  return (
    newarr(3, (_, i) =>
      newarr((height / 50) / (i + 1)*(i + 1) | 0, Math.random)
    ).reverse()
  )
}

function getbg(
  gradient: number[][],
  width: number,
  height: number,
  pr: number,
  h = false
) {
  const el = document.createElement("canvas")
  el.width = width * pr
  el.height = height * pr
  el.classList.add("bg")
  document.body.appendChild(el)
  const cx = el.getContext("2d")!

  let clip: Path2D
  const dr = (polygon: RoundedPoint[]) => {
    cx.save()
    cx.clearRect(0, 0, el.width, el.height)
    clip = new Path2D()
    polygon.forEach((p, i) => {
      !i && clip.moveTo(p.in.x * pr, p.in.y * pr)
      p.angle.main > 3e-4 && clip.arcTo(p.x * pr, p.y * pr, p.next.x * pr, p.next.y * pr, p.arc.radius * pr)
      clip.lineTo(p.next.in.x * pr, p.next.in.y * pr)
    })
    cx.clip(clip)

    gradient.forEach((layer, j) => {
      const img = cx.createLinearGradient(0, 0, h ? 0 : el.width, h ? el.height : 0)

      layer.forEach((y) => {
        const v = noise(
                frame * layer.length / 5555,
                y * height
              ),
              value = h ? v * v * v : 1 - (v * v * v),
              r = value * 255,
              g = value * 255,
              b = value * 255,
              a = 1 - j / gradient.length

        img.addColorStop(y, `rgba(${r},${g},${b},${a})`)
      })

      cx.fillStyle = img
      cx.fillRect(0, 0, el.width, el.height)
    })

    cx.restore()
  }
  return { el, dr }
}

document.onkeyup = ({ code }) => {
  if (code === "Space") {
    looping ? stop() : play()
  }
}

play()