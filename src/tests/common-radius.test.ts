import roundPolygon from ".."

const squrePoints = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
const squreToCircle = roundPolygon(squrePoints, 1)

test("squre to circle", () => {
  const len = squrePoints.length
  let i = len
  while (i) {
    i--
    const p = squreToCircle[i]
    expect(p.prev.id).toBe((i - 1 + len) % len)
    expect(p.next.id).toBe((i + 1) % len)
    expect(p.offset).toBeCloseTo(0.5)
    expect(p.arc.radius).toBeCloseTo(0.5)
    expect(p.arc.x).toBeCloseTo(0.5)
    expect(p.arc.y).toBeCloseTo(0.5)
  }
})

const rectPoints = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 0, y: 1 }]
const rectToCapsule = roundPolygon(rectPoints, 1)

test("rect to capsule", () => {
  rectToCapsule.forEach((p, i) => {
    expect(p.offset).toBeCloseTo(0.5)
    expect(p.arc.radius).toBeCloseTo(0.5)
    expect(p.arc.x).toBeCloseTo(i % 3 ? 1.5 : 0.5)
    expect(p.arc.y).toBeCloseTo(0.5)
  })
})

const xPoints = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
const xTo8 = roundPolygon(xPoints, 1)

test("x to 8", () => {
  const r = (Math.SQRT2 - 1) / 2
  xTo8.forEach((p, i) => {
    expect(p.offset).toBeCloseTo(0.5)
    expect(p.arc.radius).toBeCloseTo(r)
    expect(p.arc.x).toBeCloseTo(i % 3 ? 1 - r : r)
    expect(p.arc.y).toBeCloseTo(0.5)
  })
})