import roundPolygon from ".."

const squrePointsWithR = [{ x: 0, y: 0, r: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
const squreToLeaf = roundPolygon(squrePointsWithR, 1)

test("squre to leaf", () => {
  squreToLeaf.forEach((p, i) => {
    expect(p.offset).toBeCloseTo(i % 2 ? 0 : 1)
    expect(p.arc.radius).toBeCloseTo(i % 2 ? 0 : 1)
    expect(p.arc.x).toBeCloseTo(i > 1 ? 0 : 1)
    expect(p.arc.y).toBeCloseTo(i % 3 ? 0 : 1)
  })
})