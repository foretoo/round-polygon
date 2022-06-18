import "./style.sass"
import { InitPoint, RoundedPoint } from "../types"
import { getcanvas, circle, shape, vertex, CLOSE, fill, stroke, frame, loop, stop, looping, rect, animate, text, font, settext, line, TAU, pxratio } from "bratik"
import { Polio } from "./Polio"


const
  { ctx, canvas, height, width } = getcanvas(),
  radius = Number.MAX_SAFE_INTEGER,
  min = Math.min(width, height),
  initscale = 1.25,
  control = document.querySelector("label")!,
  color = [ "#7fa", "#a7f", "#fa7" ]
  // helly = {
  //   image: "🏄",
  //   ...randtxt(100)
  // }

// control.classList.add("hidden")

// function polyfabr(
//   polynum: number,
//   amount: number,
//   scale: number,
//   dur: number
// ) {
//   return Array(polynum).fill(null).map((_, i: number) => {
//     const poly = new Polio(amount - i*2, radius, scale - 0.2*i, width, height, dur)
//     i === 2 ? poly.color(color[0]) : poly.initgradient()
//     setTimeout(poly.init.bind(poly), dur / polynum  * i)
//     return poly
//   })
// }

// const polies = polyfabr(3, 9, initscale, 8000)


pxratio(1)
const verpoly = new Polio(9, radius, initscale, width, height, 8000)
verpoly.initgradient()
verpoly.init()

const horpoly = new Polio(7, radius, initscale * 0.8, width, height, 8000)
horpoly.initgradient()

const keypoly = new Polio(4, radius, initscale * 0.6, width, height, 8000)
keypoly.color(color[0])

// ctx.shadowOffsetY = 20
// font(64)
// settext("center", "middle")

// let isStreaming = false
// const record = document.querySelector("#record") as HTMLButtonElement
// const stoprecord = document.querySelector("#stop") as HTMLButtonElement
// const download = document.querySelector("#download") as HTMLAnchorElement
// const videoStream = canvas.captureStream(30)
// const mediaRecorder = new MediaRecorder(videoStream)
// const chunks: Blob[] = []
// mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
// mediaRecorder.onstop = () => {
//   const blob = new Blob(chunks, { "type" : "video/mp4" })
//   chunks.length = 0
//   const videoURL = URL.createObjectURL(blob)
//   download.href = videoURL
//   download.download = "poly.mp4"
// }
// record.onclick = () => {
//   isStreaming = true
//   mediaRecorder.start()
// }
// stoprecord.onclick = () => {
//   isStreaming = false
//   mediaRecorder.stop()
// }



const play = () => {
  // isStreaming && globepauseplay()
  
  if (frame === 160) horpoly.init()
  if (frame === 320) keypoly.init()
  // if ((frame - 160) % 480 === 0) {
  //   const fly = animate(8000)
  //   fly(helly, { ...randtxt(100) })
  // }

  bg("white")

  // polies.forEach((poly, i) => {
  //   fill(null)
  //   stroke("#0004", 0.5)
  //   circle(width/2, height/2, min*(initscale-i*0.2)/2)
  //   poly.draw()
  //   ctx.drawImage(poly.image, 0, 0)
  //   vertices(poly.points, !i ? "black" : i === 1 ? "lightgrey" : color[0])
  // })

  verpoly.draw()
  ctx.drawImage(verpoly.image, 0, 0)
  // lines(verpoly.points)
  // centres(verpoly.rounded, "white")
  vertices(verpoly.points, "black")

  horpoly.draw()
  ctx.drawImage(horpoly.image, 0, 0)
  // lines(horpoly.points)
  // centres(horpoly.rounded, "black")
  vertices(horpoly.points, "lightgrey")

  keypoly.draw()
  ctx.drawImage(keypoly.image, 0, 0)
  vertices(keypoly.points, color[0])

  // ctx.shadowColor = "#0004"
  // ctx.shadowBlur = 20
  // text(helly.image, helly.x, helly.y)
  // ctx.shadowColor = "transparent"
  // ctx.shadowBlur = 0

  fill(null)
  stroke("#0004", 0.5)
  circle(width/2, height/2, min/2*initscale)
  circle(width/2, height/2, min/2*initscale*0.8)
  circle(width/2, height/2, min/2*initscale*0.6)

  // isStreaming && videoStream.getVideoTracks()[0].requestFrame()
  // isStreaming && globepauseplay()
}

function bg(color: string) {
  fill(color)
  rect(0, 0, width, height)
}

function lines(points: InitPoint[]) {
  stroke("#0004", 0.5)
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

// function randtxt(mg: number) {
//   return {
//     x: mg + Math.random() * (width - mg * 2),
//     y: mg + Math.random() * (height - mg * 2)
//   }
// }
const globepauseplay = () => {
  if (looping) {
    stop()
    // polies.forEach((poly) => poly.pause())
    verpoly.pause()
    horpoly.pause()
    keypoly.pause()
  }
  else {
    loop(play)
    // polies.forEach((poly) => poly.play())
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
canvas.onpointerdown = canvas.onkeydown = pausehandle

loop(play)