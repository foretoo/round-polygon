const getLength = (A, B) => Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
const getAngle = (A, B, C) => {
  if (!C)
    return Math.atan2(B.y - A.y, B.x - A.x);
  else {
    const AB = getLength(A, B), BC = getLength(B, C), CA = getLength(C, A);
    return Math.acos((AB * AB + BC * BC - CA * CA) / (2 * AB * BC));
  }
};
const PI = Math.PI, TAU = PI * 2;
const getClockDir = (angle1, angle2) => {
  const diff = angle2 - angle1;
  return diff > PI && diff < TAU || diff < 0 && diff > -PI ? -1 : 1;
};
const getAngles = (prev_point, curr_point, next_point) => {
  const main = getAngle(prev_point, curr_point, next_point), prev = getAngle(curr_point, prev_point), next = getAngle(curr_point, next_point), vel = 1 / Math.tan(main / 2), dir = getClockDir(prev, next), bis = prev + dir * main / 2;
  return { main, next, prev, vel, dir, bis };
};

const roundPolygon = (points, radius = 0) => {
  const preRoundedPoints = points.map((curr, id) => {
    const prev = points[(id - 1 + points.length) % points.length], next = points[(id + 1) % points.length], nextLength = getLength(curr, next), prevLength = getLength(prev, curr), angle = getAngles(prev, curr, next), lim = curr.r !== void 0 ? Math.min(nextLength / angle.vel, prevLength / angle.vel, curr.r) : 0;
    return {
      ...curr,
      angle,
      offset: 0,
      arc: { radius, hit: radius, lim },
      in: { length: prevLength, rest: prevLength },
      out: { length: nextLength, rest: nextLength },
      locked: false,
      id,
      get prev() {
        return preRoundedPoints[(id - 1 + points.length) % points.length];
      },
      get next() {
        return preRoundedPoints[(id + 1) % points.length];
      }
    };
  });
  preRoundedPoints.forEach((p) => {
    p.arc.hit = Math.min(p.out.length / (p.angle.vel + p.next.angle.vel), p.in.length / (p.angle.vel + p.prev.angle.vel));
  });
  const preRoundedLimPoints = preRoundedPoints.filter((p) => p.arc.lim > 0);
  if (preRoundedLimPoints.length) {
    let minLimPoint = getMinHit(preRoundedLimPoints);
    while (minLimPoint) {
      calcLimit(minLimPoint);
      minLimPoint = getMinHit(preRoundedLimPoints);
    }
  }
  const preRoundedZeroLimPoints = preRoundedPoints.filter((p) => p.arc.lim === 0);
  if (preRoundedZeroLimPoints.length && radius > 0) {
    let minHitPoint = getMinHit(preRoundedPoints);
    while (minHitPoint) {
      calcRound(minHitPoint, radius);
      minHitPoint = getMinHit(preRoundedPoints);
    }
  }
  const roundedPoints = preRoundedPoints.map((p) => {
    const bisLength = p.arc.radius / Math.sin(p.angle.main / 2);
    return {
      id: p.id,
      x: p.x,
      y: p.y,
      angle: {
        main: p.angle.main,
        prev: p.angle.prev,
        next: p.angle.next,
        bis: p.angle.bis,
        dir: p.angle.dir
      },
      offset: p.offset,
      arc: {
        radius: p.arc.radius,
        x: p.x + Math.cos(p.angle.bis) * bisLength,
        y: p.y + Math.sin(p.angle.bis) * bisLength
      },
      in: {
        length: p.in.length,
        x: p.x + Math.cos(p.angle.prev) * p.offset,
        y: p.y + Math.sin(p.angle.prev) * p.offset
      },
      out: {
        length: p.out.length,
        x: p.x + Math.cos(p.angle.next) * p.offset,
        y: p.y + Math.sin(p.angle.next) * p.offset
      },
      get prev() {
        return roundedPoints[(p.id - 1 + points.length) % points.length];
      },
      get next() {
        return roundedPoints[(p.id + 1) % points.length];
      }
    };
  });
  return roundedPoints;
};
const calcLimit = (curr) => {
  const { prev, next } = curr;
  if (prev.locked && !next.locked)
    curr.arc.radius = Math.min(Math.max((curr.out.length - next.arc.lim * next.angle.vel) / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel)), curr.in.rest / curr.angle.vel, curr.arc.lim);
  else if (next.locked && !prev.locked)
    curr.arc.radius = Math.min(Math.max((curr.in.length - prev.arc.lim * prev.angle.vel) / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel)), curr.out.rest / curr.angle.vel, curr.arc.lim);
  else if (next.locked && prev.locked)
    curr.arc.radius = Math.min(curr.in.rest / curr.angle.vel, curr.out.rest / curr.angle.vel, curr.arc.lim);
  else
    curr.arc.radius = Math.min(Math.max((curr.in.length - prev.arc.lim * prev.angle.vel) / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel)), Math.max((curr.out.length - next.arc.lim * next.angle.vel) / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel)), curr.arc.lim);
  lockPoint(curr);
};
const calcRound = (curr, radius) => {
  if (radius > curr.arc.hit) {
    const { prev, next } = curr;
    if (prev.locked && !next.locked)
      curr.arc.radius = Math.max(Math.min(curr.in.rest / curr.angle.vel, curr.out.length / (curr.angle.vel + next.angle.vel), curr.arc.radius), 0);
    else if (next.locked && !prev.locked)
      curr.arc.radius = Math.max(Math.min(curr.out.rest / curr.angle.vel, curr.in.length / (curr.angle.vel + prev.angle.vel), curr.arc.radius), 0);
    else if (next.locked && prev.locked)
      curr.arc.radius = Math.max(Math.min(curr.in.rest / curr.angle.vel, curr.out.rest / curr.angle.vel, curr.arc.radius), 0);
    else
      curr.arc.radius = curr.arc.hit;
    lockPoint(curr);
  } else
    lockPoint(curr);
};
const lockPoint = (curr) => {
  const { prev, next } = curr;
  curr.offset = curr.arc.radius * curr.angle.vel;
  prev.out.rest -= curr.offset;
  curr.in.rest -= curr.offset;
  curr.out.rest -= curr.offset;
  next.in.rest -= curr.offset;
  curr.locked = true;
  prev.arc.hit = Math.min(prev.in.length / (prev.angle.vel + prev.prev.angle.vel), prev.in.rest / prev.angle.vel, prev.out.rest / prev.angle.vel);
  next.arc.hit = Math.min(next.out.length / (next.angle.vel + next.next.angle.vel), next.out.rest / next.angle.vel, next.in.rest / next.angle.vel);
};
const getMinHit = (arr) => arr.reduce((min, p) => p.locked ? min : !min ? p : p.arc.hit < min.arc.hit ? p : min, null);

export { roundPolygon as default };
