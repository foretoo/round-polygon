import SimplexNoise from "https://unpkg.com/simplex-noise@3.0.1/dist/esm/simplex-noise.js"
import { frame, animate, pxratio } from "./bratik.js"
import roundPolygon from "../lib/round-polygon.es.js"
const simplex = new SimplexNoise()
export class Polio {
  constructor(num, radius, width, height) {
    this.num = num
    this.radius = radius
    this.width = width
    this.height = height
    this.draw = () => undefined
    this.color("black")
    this.pr = pxratio()
    this.image = document.createElement("canvas")
    this.image.width = width * this.pr
    this.image.height = height * this.pr
    this.image.classList.add("bg")
    document.body.appendChild(this.image)
    this.ctx = this.image.getContext("2d")
    this.clip = new Path2D()
    this.getpoint = this.getpoint.bind(this)
    this.points = Array(this.num).fill(null).map(this.getpoint)
    this.rounded = roundPolygon(this.points, this.radius)
  }
  update(dur) {
    for (let i = 0; i < this.num; i++) {
      const move = animate(dur, "cubicInOut", () => {
        this.rounded = roundPolygon(this.points, this.radius)
      })
      const newp = this.getpoint()
      move(this.points[i], { x: newp.x, y: newp.y })
    }
  }
  color(color) {
    this.draw = () => {
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
      this.clippolio()
      this.ctx.fillStyle = color
      this.ctx.fillRect(0, 0, this.image.width, this.image.height)
      this.ctx.restore()
    }
  }
  initgradient() {
    const gradient = newarr(3, (_, i) => newarr((this.height / 50) / (i + 1) * (i + 1) | 0, Math.random)).reverse()
    const h = Polio.count % 2 === 0 ? true : false
    this.draw = () => {
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
      this.clippolio()
      gradient.forEach((layer, j) => {
        const img = this.ctx.createLinearGradient(0, 0, h ? 0 : this.image.width, h ? this.image.height : 0)
        layer.forEach((y) => {
          const v = noise(frame * layer.length / 5555, y * this.height), value = h ? v * v * v : 1 - (v * v * v), r = value * 255, g = value * 255, b = value * 255, a = 1 - j / gradient.length
          img.addColorStop(y, `rgba(${r},${g},${b},${a})`)
        })
        this.ctx.fillStyle = img
        this.ctx.fillRect(0, 0, this.image.width, this.image.height)
      })
      this.ctx.restore()
    }
    Polio.count++
  }
  getpoint() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
    }
  }
  clippolio() {
    const pr = this.pr
    this.clip = new Path2D()
    this.rounded.forEach((p, i) => {
      !i && this.clip.moveTo(p.in.x * pr, p.in.y * pr)
      p.angle.main > 3e-4 && this.clip.arcTo(p.x * pr, p.y * pr, p.next.x * pr, p.next.y * pr, p.arc.radius * pr)
      this.clip.lineTo(p.next.in.x * pr, p.next.in.y * pr)
    })
    this.ctx.clip(this.clip)
  }
}
Polio.count = 0
function noise(x, y) {
  return (simplex.noise2D(x, y) + 1) / 2
}
function newarr(length, mapper) {
  return Object.prototype.toString.call(mapper) === "[object Function]"
    ? Array(length).fill(null).map(mapper)
    : Array(length).fill(mapper)
}
