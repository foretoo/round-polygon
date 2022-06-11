const PI = Math.PI, TAU = PI * 2
const round = (n) => Math.round(n * 1e10) / 1e10
const getLength = (A, B) => round(Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)))
const getAngle = (A, B, C) => {
  if (!C) return Math.atan2(B.y - A.y, B.x - A.x)
  else {
    const AB = getLength(A, B), BC = getLength(B, C), CA = getLength(C, A)
    return Math.acos((AB * AB + BC * BC - CA * CA) / (2 * AB * BC))
  }
}
const getClockDir = (angle1, angle2) => {
  const diff = angle2 - angle1
  return diff > PI && diff < TAU || diff < 0 && diff > -PI ? -1 : 1
}
const getAngles = (prevPoint, currPoint, nextPoint) => {
  const main = getAngle(prevPoint, currPoint, nextPoint), prev = getAngle(currPoint, prevPoint), next = getAngle(currPoint, nextPoint), vel = 1 / Math.tan(main / 2), dir = getClockDir(prev, next), bis = prev + dir * main / 2
  return { main, next, prev, vel, dir, bis }
}

const roundPolygon = (points, radius = 0) => {
  const preRoundedPoints = [], limPoints = [], noLimPoints = [], zeroLimPoints = []
  points.forEach((curr, id) => {
    const prev = points[(id - 1 + points.length) % points.length], next = points[(id + 1) % points.length], nextLength = getLength(curr, next), prevLength = getLength(prev, curr), angle = getAngles(prev, curr, next)
    if (angle.main === 0) {
      angle.main = Number.EPSILON
      angle.vel = Number.MAX_SAFE_INTEGER
    }
    if (angle.main === PI) angle.vel = 0
    const preRoundedPoint = {
      ...curr,
      angle,
      offset: 0,
      arc: {
        radius,
        hit: radius,
        lim: curr.r !== void 0 ? Math.min(nextLength / angle.vel, prevLength / angle.vel, curr.r) : 0,
      },
      in: { length: prevLength, rest: prevLength },
      out: { length: nextLength, rest: nextLength },
      locked: false,
      id,
      get prev() {
        return preRoundedPoints[(id - 1 + points.length) % points.length]
      },
      get next() {
        return preRoundedPoints[(id + 1) % points.length]
      },
    }
    if (isNaN(angle.main)) {
      angle.main = 0
      angle.bis = angle.prev || angle.next
      zeroLimPoints.push(preRoundedPoint)
    }
    if (typeof curr.r === "number")
      if (curr.r === 0) zeroLimPoints.push(preRoundedPoint)
      else limPoints.push(preRoundedPoint)
    else noLimPoints.push(preRoundedPoint)
    preRoundedPoints.push(preRoundedPoint)
  })
  if (zeroLimPoints.length)
    zeroLimPoints.forEach((p) => {
      p.angle.vel = 0
      p.arc.radius = 0
      lockPoint(p)
    })
  preRoundedPoints.forEach((p) => {
    p.arc.hit = Math.min(p.out.rest / (p.angle.vel + p.next.angle.vel), p.in.rest / (p.angle.vel + p.prev.angle.vel))
  })
  if (limPoints.length) {
    let minHitPoint = getMinHit(limPoints)
    while (minHitPoint) {
      calcLimitRadius(minHitPoint)
      minHitPoint = getMinHit(limPoints)
    }
  }
  if (noLimPoints.length && radius > 0) {
    let minHitPoint = getMinHit(preRoundedPoints)
    while (minHitPoint) {
      calcCommonRadius(minHitPoint, radius)
      minHitPoint = getMinHit(preRoundedPoints)
    }
  }
  const roundedPoints = preRoundedPoints.map((p) => {
    const bisLength = p.arc.radius / Math.sin(p.angle.main / 2)
    return {
      id: p.id,
      x: p.x,
      y: p.y,
      angle: {
        main: round(p.angle.main),
        prev: p.angle.prev,
        next: p.angle.next,
        bis: p.angle.bis,
        dir: p.angle.dir,
      },
      offset: round(p.offset),
      arc: {
        radius: round(p.arc.radius),
        x: p.x + (Math.cos(p.angle.bis) * bisLength || 0),
        y: p.y + (Math.sin(p.angle.bis) * bisLength || 0),
      },
      in: {
        length: p.in.length,
        x: p.x + Math.cos(p.angle.prev) * p.offset,
        y: p.y + Math.sin(p.angle.prev) * p.offset,
      },
      out: {
        length: p.out.length,
        x: p.x + Math.cos(p.angle.next) * p.offset,
        y: p.y + Math.sin(p.angle.next) * p.offset,
      },
      get prev() {
        return roundedPoints[(p.id - 1 + points.length) % points.length]
      },
      get next() {
        return roundedPoints[(p.id + 1) % points.length]
      },
    }
  })
  return roundedPoints
}
const calcLimitRadius = (curr) => {
  const { prev, next } = curr
  if (prev.locked && !next.locked)
    curr.arc.radius = Math.min(Math.max((curr.out.length - next.arc.lim * next.angle.vel) / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel)), curr.in.rest / curr.angle.vel, curr.arc.lim)
  else if (next.locked && !prev.locked)
    curr.arc.radius = Math.min(Math.max((curr.in.length - prev.arc.lim * prev.angle.vel) / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel)), curr.out.rest / curr.angle.vel, curr.arc.lim)
  else if (next.locked && prev.locked)
    curr.arc.radius = Math.min(curr.in.rest / curr.angle.vel, curr.out.rest / curr.angle.vel, curr.arc.lim)
  else
    curr.arc.radius = Math.min(Math.max((curr.in.length - prev.arc.lim * prev.angle.vel) / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel)), Math.max((curr.out.length - next.arc.lim * next.angle.vel) / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel)), curr.arc.lim)
  lockPoint(curr)
}
const calcCommonRadius = (curr, radius) => {
  if (radius > curr.arc.hit) {
    const { prev, next } = curr
    if (prev.locked && !next.locked)
      curr.arc.radius = Math.max(Math.min(curr.in.rest / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel), curr.arc.radius), 0)
    else if (next.locked && !prev.locked)
      curr.arc.radius = Math.max(Math.min(curr.out.rest / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel), curr.arc.radius), 0)
    else if (next.locked && prev.locked)
      curr.arc.radius = Math.max(Math.min(curr.in.rest / curr.angle.vel, curr.out.rest / curr.angle.vel, curr.arc.radius), 0)
    else
      curr.arc.radius = curr.arc.hit
  }
  lockPoint(curr)
}
const lockPoint = (curr) => {
  const { prev, next } = curr
  curr.offset = curr.arc.radius * curr.angle.vel
  prev.out.rest -= curr.offset
  curr.in.rest -= curr.offset
  curr.out.rest -= curr.offset
  next.in.rest -= curr.offset
  curr.locked = true
  prev.arc.hit = Math.min(prev.in.length / (prev.angle.vel + prev.prev.angle.vel), prev.in.rest / prev.angle.vel, prev.out.rest / prev.angle.vel)
  next.arc.hit = Math.min(next.out.length / (next.angle.vel + next.next.angle.vel), next.out.rest / next.angle.vel, next.in.rest / next.angle.vel)
}
const getMinHit = (arr) => arr.reduce((min, p) => p.locked ? min : !min ? p : p.arc.hit < min.arc.hit ? p : min, null)

export { roundPolygon as default }
