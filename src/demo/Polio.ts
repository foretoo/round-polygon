import { InitPoint, RoundedPoint } from "../types"
import { frame, animate, pxratio, TAU } from "bratik"
import SimplexNoise from "simplex-noise"
import roundPolygon from ".."

const simplex = new SimplexNoise()

export class Polio {

  static count = 0

  id: number
  num: number
  radius: number
  scale: number
  width: number
  height: number
  min: number

  points: InitPoint[]
  rounded: RoundedPoint[]
  image: HTMLCanvasElement
  draw: () => void
  dur: number

  private pr: number
  private ctx: CanvasRenderingContext2D
  private clip: Path2D
  private player: ReturnType<typeof animate>[]
  private updater: ReturnType<typeof animate>
  private angles: { a: number }[]



  constructor(
    num: number,
    radius: number,
    scale: number,
    width: number,
    height: number,
    dur: number
  ) {
    this.id = Polio.count
    this.num = num
    this.radius = radius
    this.scale = scale
    this.width = width
    this.height = height
    this.min = Math.min(width, height) * this.scale

    this.draw = () => undefined
    this.color("black")
    this.pr = pxratio(1)
    this.image = document.createElement("canvas")
    this.image.width = width * this.pr
    this.image.height = height * this.pr
    this.image.classList.add("bg")
    document.body.appendChild(this.image)
    this.ctx = this.image.getContext("2d")!
    this.clip = new Path2D()

    this.getpoint = this.getpoint.bind(this)

    this.angles = Array(this.num).fill(null).map(this.setangle)
    this.points = Array(this.num).fill(null).map((_, i) => ({
      x: this.width / 2  + Math.cos(this.angles[i].a) * this.min / 2,
      y: this.height / 2 + Math.sin(this.angles[i].a) * this.min / 2
    }))
    this.rounded = roundPolygon(this.points, this.radius)

    this.dur = dur
    this.updater = animate({
      dur: this.dur,
      loop: true,
      ontick: () => {
        this.points.forEach((p, i) => {
          p.x = this.width / 2  + Math.cos(this.angles[i].a) * this.min / 2
          p.y = this.height / 2 + Math.sin(this.angles[i].a) * this.min / 2
        })
        this.rounded = roundPolygon(this.points, this.radius)
      },
    })
    this.player = this.angles.map((_, i) => animate({
      dur: this.dur,
      ease: "cubicInOut",
      onend: () => this.player[i].on(this.angles[i], this.setangle())
    }))
  }

  pause() {
    this.updater.pause()
    this.player.forEach(p => p.pause())
  }

  play() {
    this.updater.play()
    this.player.forEach(p => p.play())
  }

  init() {
    this.updater.on({ t: 0 }, { t: 1 })
    for (let i = 0; i < this.num; i++) {
      this.player[i].on(this.angles[i], this.setangle())
    }
  }

  color(color: string) {
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
    const gradient = newarr(3, (_, i) =>
      newarr((this.height / 50) / (i + 1)*(i + 1) | 0, Math.random)
    ).reverse()

    const h = Polio.count % 2 === 0 ? true : false

    this.draw = () => {
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
      this.clippolio()

      gradient.forEach((layer, j) => {
        const img = this.ctx.createLinearGradient(0, 0, h ? 0 : this.image.width, h ? this.image.height : 0)
        layer.forEach((y) => {
          const
            v = noise(frame * layer.length / 5555, y * this.height),
            value = h ? v * v * v : 1 - (v * v * v),
            r = value * 255,
            g = value * 255,
            b = value * 255,
            a = 1 - j / gradient.length

          img.addColorStop(y, `rgba(${r},${g},${b},${a})`)
        })
        this.ctx.fillStyle = img
        this.ctx.fillRect(0, 0, this.image.width, this.image.height)
      })

      this.ctx.restore()
    }

    Polio.count++
  }



  private setangle = () => ({ a: Math.random() * TAU })

  private getpoint() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
    }
  }

  private clippolio() {
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

function noise(x: number, y: number) {
  return ( simplex.noise2D(x, y) + 1 ) / 2
}

type Mapper<T> = (value: unknown, index: number) => T
function newarr<T>(length: number, mapper: T | Mapper<T>): T[] {
  return Object.prototype.toString.call(mapper) === "[object Function]"
  ? Array(length).fill(null).map(mapper as Mapper<T>)
  : Array(length).fill(mapper as T)
}