import { InitPoint } from "../types"
import { round, getLength, getClockDir, getAngles, PI, TAU } from "../utils"


test("round", () => {
  expect(round(0 + 0.1)).toBeCloseTo(1 - 0.9, 10)
})

test("PI", () => {
  expect(PI).toBe(Math.PI)
})

test("TAU", () => {
  expect(TAU).toBe(Math.PI * 2)
})

test("getLength", () => {
  expect(getLength({ x:0, y:0 }, { x:1, y:1 })).toBe(round(Math.SQRT2))
})



test("getClockDir -> 1", () => {
  expect(getClockDir(Math.PI, Math.PI * 1.25)).toBe(1)
})
test("getClockDir -> -1", () => {
  expect(getClockDir(0, -Math.PI * 0.25)).toBe(-1)
})



const points = [
  { x:1, y:1 }, { x:0, y:0 }, { x:1, y:0 },
] as [
  InitPoint, InitPoint, InitPoint
]
const lengths = [
  getLength(points[0], points[1]),
  getLength(points[0], points[2]),
  getLength(points[1], points[2]),
] as [
  number, number, number
]

test("getAngles", () => {
  const data = getAngles(...points, ...lengths)
  const vel = 1 / Math.tan(data.main / 2)

  expect(data.prev).toBeCloseTo(Math.PI / 4, 8)
  expect(data.main).toBeCloseTo(Math.PI / 4, 8)
  expect(data.next).toBeCloseTo(0, 8)
  expect(data.bis) .toBeCloseTo(Math.PI / 8, 8)
  expect(data.vel) .toBeCloseTo(vel, 8)
  expect(data.dir) .toBe(-1)
})