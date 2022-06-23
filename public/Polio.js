import SimplexNoise from "https://unpkg.com/simplex-noise@3.0.1/dist/esm/simplex-noise.js"
import { frame, animate, pxratio, TAU } from "https://unpkg.com/bratik@latest/lib/bratik.es.js"
import roundPolygon from "../lib/round-polygon.es.js"
const simplex = new SimplexNoise()
export class Polio {
  constructor(ctx, num, radius, scale, width, height, dur) {
    this.rndangle = () => (Math.random() - 0.5) * TAU * 4 / 3
    this.id = Polio.count
    this.num = num
    this.pr = pxratio()
    this.radius = radius * this.pr
    this.scale = scale
    this.width = width * this.pr
    this.height = height * this.pr
    this.min = Math.min(width, height) * this.scale
    this.ctx = ctx
    this.draw = () => undefined
    this.color("black")
    this.clip = new Path2D()
    this.getpoint = this.getpoint.bind(this)
    this.init = this.init.bind(this)
    this.points = Array(this.num).fill(null).map(() => {
      const a = this.rndangle() * 1.5
      return {
        a,
        x: this.width / 2 / this.pr + Math.cos(a) * this.min / 2,
        y: this.height / 2 / this.pr + Math.sin(a) * this.min / 2,
      }
    })
    this.rounded = roundPolygon(this.points, this.radius)
    this.dur = dur
    this.updater = animate({
      dur: this.dur,
      ease: "cubicInOut",
      ontick: () => {
        this.points.forEach((p) => {
          p.x = this.width / 2 / this.pr + Math.cos(p.a) * this.min / 2
          p.y = this.height / 2 / this.pr + Math.sin(p.a) * this.min / 2
        })
        this.rounded = roundPolygon(this.points, this.radius)
      },
      onend: this.init,
    })
    Polio.count++
  }
  init() {
    const newangles = this.points.map(({ a }) => ({ a: (a + this.rndangle()) % TAU }))
    this.updater.on(this.points, newangles)
  }
  color(color) {
    this.draw = () => {
      this.ctx.save()
      this.clippolio()
      this.ctx.fillStyle = color
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.restore()
    }
  }
  gradient() {
    const gradient = newarr(3, (_, i) => newarr((this.height / 50) / (i + 1) * (i + 1) | 0, Math.random)).reverse()
    const h = Polio.count % 2 === 1 ? true : false
    this.draw = () => {
      this.ctx.save()
      this.clippolio()
      gradient.forEach((layer, j) => {
        const img = this.ctx.createLinearGradient(0, 0, h ? 0 : this.width, h ? this.height : 0)
        layer.forEach((y) => {
          const v = noise(frame * layer.length / 5555, y * this.height), value = h ? v * v * v : 1 - (v * v * v), r = value * 255, g = value * 255, b = value * 255, a = 1 - j / gradient.length
          img.addColorStop(y, `rgba(${r},${g},${b},${a})`)
        })
        this.ctx.fillStyle = img
        this.ctx.fillRect(0, 0, this.width, this.height)
      })
      this.ctx.restore()
    }
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
