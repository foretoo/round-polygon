import roundPolygon, { InitPoint, RoundedPoint } from ".."



const squreToLeafCheck = (poly: RoundedPoint[] ) => {
  poly.forEach((p, i) => {
    expect(p.offset).toBeCloseTo(i % 2 ? 0 : 1)
    expect(p.arc.radius).toBeCloseTo(i % 2 ? 0 : 1)
    expect(p.arc.x).toBeCloseTo(i > 1 ? 0 : 1)
    expect(p.arc.y).toBeCloseTo(i % 3 ? 0 : 1)
  })
}

const squrePointsWithR = [{ x: 0, y: 0, r: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
const squreToLeafWithR = roundPolygon(squrePointsWithR, 1)

test("a squre should round to a leaf, with one full-sized point-radius", () => {
  squreToLeafCheck(squreToLeafWithR)
})

const squrePointsWithZeroR = [{ x: 0, y: 0 }, { x: 1, y: 0, r: 0 }, { x: 1, y: 1 }, { x: 0, y: 1, r: 0 }]
const squreToLeafWithZeroR = roundPolygon(squrePointsWithZeroR, 1)

test("a squre should round to a leaf, with two diagonally placed zero-sized point-radii", () => {
  squreToLeafCheck(squreToLeafWithZeroR)
})



const MPoints: InitPoint[] = [
  { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 0, y: 0 },
  { x: 1, y: 1 },
]
MPoints.forEach((p, i) => i < MPoints.length - 1 && (p.r = 2))
const MTom = roundPolygon(MPoints, 2)

test("'M' shape should round to 'ო' shape, with one common radius point in the middle", () => {
  MTom.forEach((p, i) => {
    if (i < MPoints.length - 1) {
      expect(p.offset).toBeCloseTo(i % 3 ? 2 - Math.SQRT2 : Math.SQRT2)
      expect(p.arc.radius).toBeCloseTo(2 - Math.SQRT2)
      expect(p.arc.x).toBeCloseTo(i > 1 ? 2 - Math.SQRT2 : Math.SQRT2)
      expect(p.arc.y).toBeCloseTo(Math.SQRT2)
    }
    else {
      expect(p.offset).toBeCloseTo(0)
      expect(p.arc.radius).toBeCloseTo(0)
      expect(p.arc.x).toBeCloseTo(1)
      expect(p.arc.y).toBeCloseTo(1)
    }
  })
})

const mPoints: InitPoint[] = [
  { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 },
  { x: 2, y: 1 }, { x: 0, y: 1 },
]
mPoints.forEach((p, i) => i < 3 && (p.r = 1))
const mToWave = roundPolygon(mPoints, 1)

test("'M' shape should round to wave shape, with two common radius points in the bottom edges'", () => {
  const v = Math.SQRT2 - 1
  const k = 2 - Math.SQRT2
  mToWave.forEach((p, i) => {
    if (i < 3) {
      expect(p.offset).toBeCloseTo(i % 2 ? v : 1)
      expect(p.arc.radius).toBeCloseTo(v)
      expect(p.arc.x).toBeCloseTo(v + i * k)
      expect(p.arc.y).toBeCloseTo(i % 2 ? v : 1)
    }
    else {
      expect(p.offset).toBeCloseTo(0)
      expect(p.arc.radius).toBeCloseTo(0)
      expect(p.arc.x).toBeCloseTo(i % 2 ? 2 : 0)
      expect(p.arc.y).toBeCloseTo(1)
    }
  })
})



const diamondPoints = [
  { x: 1, y: 0, r: 1 }, { x: 2, y: 1, r: 1 },
  { x: 1, y: 2 },
  { x: 0, y: 1, r: 1 }, { x: 1, y: 0, r: 1 },
  { x: 1, y: 1 }
]
const diamondToHeart = roundPolygon(diamondPoints)

test("a diamond should round to a heart, with point-radii on top and middle edges, and without common radius", () => {
  diamondToHeart.forEach((p, i) => {
    if (i === 2) {
      expect(p.offset).toBeCloseTo(0)
      expect(p.arc.radius).toBeCloseTo(0)
      expect(p.arc.x).toBeCloseTo(1)
      expect(p.arc.y).toBeCloseTo(2)
    }
    else if (i === diamondPoints.length - 1) {
      expect(p.offset).toBeCloseTo(0)
      expect(p.arc.radius).toBeCloseTo(0)
      expect(p.arc.x).toBeCloseTo(1)
      expect(p.arc.y).toBeCloseTo(1)
    }
    else {
      expect(p.offset).toBeCloseTo(i % 4 ? Math.SQRT2 - 1 : 1)
      expect(p.arc.radius).toBeCloseTo(Math.SQRT2 - 1)
      expect(p.arc.x).toBeCloseTo(i < 3 ? Math.SQRT2 : 2 - Math.SQRT2)
      expect(p.arc.y).toBeCloseTo(1)
    }
  })
})