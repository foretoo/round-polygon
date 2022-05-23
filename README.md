
# round-polygon

Small, typed, dependency-free tool to round corners of 2d-polygon provided by an array of `{ x, y }` points.

###  [Demo page](https://foretoo.github.io/round-polygon)

## Installation

by npm:
```
npm i round-polygon
```
and then
```javascript
import roundPolygon from "round-polygon"
```
or if you don't use npm you can import module from unpkg:
```javascript
import roundPolygon from "https://unpkg.com/round-polygon@0.5.1/lib/round-polygon.es.js"
```
or by script tag (with a link to IIFE module) in your html page:
```html
<script src="https://unpkg.com/round-polygon@0.5.1/lib/round-polygon.iife.js"></script>
```

## Usage

```javascript
// if you use TypeScript you can also import input type "Point" and output type "RoundedPoint"
import roundPolygon, { Point, RoundedPoint } from "round-polygon"

let polygonToRound: Point[],
    roundedPolygon: RoundedPoint[]
```

roundPolygon takes two arguments: an array of initial points and a radius

```javascript
polygonToRound = [
  { x: 100, y:   0 },
  { x:   0, y: 150 },
  { x: 200, y: 150 },
  { x: 200, y:   0 },
  { x: 150, y: 200 },
]

roundedPolygon = roundPolygon(polygonToRound, 20)
```
a rounded point is an object with provided properties:

```javascript
{
  id: number, // index of the current point
  x: number, // x-coordinate of the initial point
  y: number, // y-coordinate of the initial point
  offset: number, // length between the initial point and the start or the end of a rounding arc
  angle: { // in radians
    main: number, // the angle between the previous point, the current one, and the next one
    prev: number, // the angle between prev-to-curr-line to x-Axis
    next: number, // the angle between next-to-curr-line to x-Axis
    bis: number, // the bisector angle to x-Axis
    dir: 1 | -1 // whether clockwise (1) or counter-clockwise (-1) is the main angle direction (from the previous to the next angle)
  },
  arc: {
    radius: number, // the rounding radius of the current point (might be less then provided as an argument (caused by rounding overlapping))
    x: number, // x-coordinate of rounding center
    y: number // y-coordinate of rounding center
  },
  in: {
    length: number, // the length of prev-to-curr-line
    x: number, // x-coordinate where the arc begins laying on prev-to-curr-line
    y: number // y-coordinate where the arc begins laying on prev-to-curr-line
  },
  out: {
    length: number, // the length of next-to-curr-line
    x: number, // x-coordinate where arc ends laying on next-to-curr-line
    y: number // y-coordinate where arc ends laying on next-to-curr-line
  },
  prev: {...}, // a getter, returns prev-indexed rounded point
  next: {...} // a getter, returns next-indexed rounded point
}
```

so the whole approach to draw a rounded shape using, for example, Canvas API looks like this:

```javascript
const
  canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  polygonToRound = [
    { x: 120, y:  20 },
    { x:  20, y: 170 },
    { x: 220, y: 170 },
    { x: 220, y:  20 },
    { x: 170, y: 220 },
  ],
  roundedPolygon = roundPolygon(polygonToRound, 100)

// drawing
ctx.beginPath()
roundedPolygon.forEach((p) => {
  ctx.moveTo(p.in.x, p.in.y)
  ctx.arcTo(p.x, p.y, p.out.x, p.out.y, p.arc.radius)
  ctx.lineTo(p.next.in.x, p.next.in.y)
})
ctx.stroke()
```

The algorithm prevents rounding overlaps, so if you pass an oversized radius, it won't break the shape, but instead calculate the maximum radius of each point with respect to rounding collisions order.

![demo](./public/demo.png)