import roundPolygon, { getSegments } from ".."

const points = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
]
const polygon = roundPolygon(points, 1)

test("AMOUNT==1, square should transform to circle with 4 segments", () => {
  expect(getSegments(polygon, "AMOUNT", 1).length).toBe(4)
})
test("AMOUNT==2, square should transform to circle with 8 segments", () => {
  expect(getSegments(polygon, "AMOUNT", 2).length).toBe(8)
})