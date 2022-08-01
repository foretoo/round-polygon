import roundPolygon from ".."

const crossPoints = [
  { x: 1, y: 0 }, { x: 1, y: 1 },
  { x: 2, y: 1 }, { x: 1, y: 1 },
  { x: 1, y: 2 }, { x: 1, y: 1 },
  { x: 0, y: 1 }, { x: 1, y: 1 },
]
const crossToPoint = roundPolygon(crossPoints, Number.EPSILON)

test("a cross should round to a single point even with 'epsilon' radius", () => {
  crossToPoint.forEach((p, i) => {
    expect(p.offset).toBeCloseTo(i % 2 ? 0 : 1)
    expect(p.arc.radius).toBeCloseTo(0)
    expect(p.arc.x).toBeCloseTo(1)
    expect(p.arc.y).toBeCloseTo(1)
  })
})

const overlappedPoints = [
  { x: 0, y: 0 },
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }
]
const overlappedToDrop = roundPolygon(overlappedPoints, 1)

test("a square with 2 overlapped points should round to a drop", () => {
  overlappedToDrop.forEach((p, i) => {
    const v = i > 1 ? 0.5 : 0
    expect(p.offset).toBeCloseTo(v)
    expect(p.arc.radius).toBeCloseTo(v)
    expect(p.arc.x).toBeCloseTo(v)
    expect(p.arc.y).toBeCloseTo(v)
  })
})

const squareWithSubdividedEdgePoints = [
  { x: 0.5, y: 0 },
  { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 },
]
const squareWithSubdividedEdgeToCircle = roundPolygon(squareWithSubdividedEdgePoints, 1)

test("a square with a subdivided by 2 top edge should round to a circle", () => {
  squareWithSubdividedEdgeToCircle.forEach((p, i) => {
    if (i) {
      expect(p.offset).toBeCloseTo(0.5)
      expect(p.arc.radius).toBeCloseTo(0.5)
      expect(p.arc.x).toBeCloseTo(0.5)
      expect(p.arc.y).toBeCloseTo(0.5)
    }
    else {
      expect(p.angle.main).toBeCloseTo(Math.PI)
      expect(p.offset).toBeCloseTo(0)
      expect(p.arc.radius).toBeCloseTo(0.5)
      expect(p.arc.x).toBeCloseTo(0.5)
      expect(p.arc.y).toBeCloseTo(-0.5)
    }
  })
})