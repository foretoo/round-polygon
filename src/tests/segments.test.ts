import roundPolygon, { getSegments } from ".."

const points = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
]
const polygon = roundPolygon(points, 1)



test("AMOUNT=0, square should not transform", () => {
  expect(getSegments(polygon, "AMOUNT", 0).length).toBe(4)
})
test("AMOUNT=1, square should transform to circle with 8 edges", () => {
  expect(getSegments(polygon, "AMOUNT", 1).length).toBe(8)
})
test("AMOUNT=2, square should transform to circle with 12 edges", () => {
  expect(getSegments(polygon, "AMOUNT", 2).length).toBe(12)
})



test("LENGTH=0, square should not transform", () => {
  expect(getSegments(polygon, "LENGTH", 0).length).toBe(4)
})
test("LENGTH=1, square should transform to circle with 8 edges", () => {
  expect(getSegments(polygon, "LENGTH", 1).length).toBe(8)
})
test("LENGTH=0.5, square should transform to circle with 12 edges", () => {
  expect(getSegments(polygon, "LENGTH", 0.5).length).toBe(12)
})