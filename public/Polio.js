import SimplexNoise from "https://unpkg.com/simplex-noise@3.0.1/dist/esm/simplex-noise.js"
import { frame, animate, pxratio, TAU } from "https://unpkg.com/bratik@latest/lib/bratik.es.js"
import roundPolygon from "../lib/round-polygon.es.js"
const simplex = new SimplexNoise()
export class Polio {
  constructor(num, radius, scale, width, height, dur) {
    this.setangle = () => ({ a: Math.random() * TAU })
    this.id = Polio.count
    this.num = num
    this.radius = radius
    this.scale = scale
    this.width = width
    this.height = height
    this.min = Math.min(width, height) * this.scale
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
    this.angles = Array(this.num).fill(null).map(() => ({ a: this.rndangle() * 1.5 }))
    this.points = Array(this.num).fill(null).map((_, i) => ({
      x: this.width / 2 + Math.cos(this.angles[i].a) * this.min / 2,
      y: this.height / 2 + Math.sin(this.angles[i].a) * this.min / 2,
    }))
    this.rounded = roundPolygon(this.points, this.radius)
    this.dur = dur
    this.updater = animate({
      dur: this.dur,
      loop: true,
      ontick: () => {
        this.points.forEach((p, i) => {
          p.x = this.width / 2 + Math.cos(this.angles[i].a) * this.min / 2
          p.y = this.height / 2 + Math.sin(this.angles[i].a) * this.min / 2
        })
        this.rounded = roundPolygon(this.points, this.radius)
      },
    })
    this.player = this.angles.map((_, i) => animate({
      dur: this.dur,
      ease: "cubicInOut",
      onend: () => {
        const a = this.angles[i].a + this.rndangle()
        this.player[i].on(this.angles[i], { a })
      },
    }))
  }
  pause() {
    this.updater.pause()
    this.player.forEach((p) => p.pause())
  }
  play() {
    this.updater.play()
    this.player.forEach((p) => p.play())
  }
  init() {
    this.updater.on({ t: 0 }, { t: 1 })
    this.player.forEach((p, i) => {
      const a = this.angles[i].a + this.rndangle()
      p.on(this.angles[i], { a })
    })
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
  rndangle = () => (Math.random() - 0.5) * TAU * 4 / 3
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
