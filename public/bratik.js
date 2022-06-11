const PI = Math.PI, TAU = PI * 2;
const CLOSE = "close";

let width, height, canvas, ctx, pr, frame = 0, looping = false;
const getcanvas = (w, h, id) => {
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  document.body.prepend(canvas);
  canvas.setAttribute("id", id ? id : "canvas");
  pr = window.devicePixelRatio;
  if (w) {
    width = w;
    height = h ? h : width;
    canvas.setAttribute("style", `width:${width}px;height:${height}px;`);
    canvas.setAttribute("width", (width * pr).toString());
    canvas.setAttribute("height", (height * pr).toString());
  } else {
    canvas.setAttribute("style", "width:100%;height:100%;");
    ({ width, height } = canvas.getBoundingClientRect());
    canvas.setAttribute("width", (width * pr).toString());
    canvas.setAttribute("height", (height * pr).toString());
  }
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = true;
  return { width, height, ctx, canvas };
};
const pxratio = (val) => {
  if (val === void 0)
    return window.devicePixelRatio;
  else {
    pr = val;
    canvas.width = width * pr;
    canvas.height = height * pr;
    return val;
  }
};
let shaping = false;
const shape = (arg) => {
  if (arg === "close")
    ctx.closePath();
  if (shaping) {
    shaping = false;
    draw();
  } else
    ctx.beginPath();
};
const vertex = (x, y) => {
  if (shaping)
    ctx.lineTo(x * pr, y * pr);
  else {
    shaping = true;
    ctx.moveTo(x * pr, y * pr);
  }
};
const arc = (x1, y1, x2, y2, r) => {
  ctx.arcTo(x1 * pr, y1 * pr, x2 * pr, y2 * pr, r * pr);
};
const line = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1 * pr, y1 * pr);
  ctx.lineTo(x2 * pr, y2 * pr);
  draw();
};
const circle = (x, y, r = 10) => {
  ctx.beginPath();
  ctx.arc(x * pr, y * pr, r * pr, 0, TAU);
  draw();
};
const rect = (x, y, w = 20, h = 20, r) => {
  ctx.beginPath();
  if (r) {
    ctx.moveTo((x + r) * pr, y * pr);
    ctx.arcTo((x + w) * pr, y * pr, (x + w) * pr, (y + h) * pr, r * pr);
    ctx.arcTo((x + w) * pr, (y + h) * pr, x * pr, (y + h) * pr, r * pr);
    ctx.arcTo(x * pr, (y + h) * pr, x * pr, y * pr, r * pr);
    ctx.arcTo(x * pr, y * pr, (x + w) * pr, y * pr, r * pr);
  } else
    ctx.rect(x * pr, y * pr, w * pr, h * pr);
  draw();
};
let font_family = "sans-serif";
const font = (size, family, options) => {
  let fontsize = "", fontoptions = options ? options : "", fontfamily = font_family;
  if (family)
    font_family = fontfamily = family;
  if (typeof size === "number")
    fontsize = size * pr + "px";
  if (typeof size === "string") {
    const temp = size.match(/^(\d+)([a-z%]*)\/?(\d*)([a-z%]*)$/);
    if (temp) {
      fontsize = parseFloat(temp[1]) * pr + (temp[2] ? temp[2] : "px");
      if (temp[3]) {
        fontsize += `/${temp[3]}`;
        fontsize += temp[4] ? temp[4] : "px";
      }
    }
  }
  ctx.font = `${fontoptions} ${fontsize} ${fontfamily}`.trim();
};
let text_width;
const settext = (align, base, width2) => {
  ctx.textAlign = align || "start";
  ctx.textBaseline = base || "alphabetic";
  text_width = width2;
};
const text = (content, x, y, width2) => {
  let size = width2 || text_width;
  size = size !== void 0 ? size * pr : size;
  ctx.fillText(content, x * pr, y * pr, size);
  ctx.strokeText(content, x * pr, y * pr, size);
};
const draw = () => {
  ctx.fill();
  ctx.stroke();
};
const fill = (color) => {
  if (color === null)
    ctx.fillStyle = "transparent";
  else
    ctx.fillStyle = color;
};
const stroke = (color, width2, cap, join) => {
  if (color === null)
    ctx.strokeStyle = "transparent";
  else
    ctx.strokeStyle = color;
  if (width2 !== void 0)
    ctx.lineWidth = width2 * pr;
  if (cap !== void 0)
    ctx.lineCap = cap;
  if (join !== void 0)
    ctx.lineJoin = join;
};
const clear = (x = 0, y = 0, w = width, h = height) => {
  ctx.clearRect(x * pr, y * pr, w * pr, h * pr);
};
let rafid;
const stop = () => {
  looping = false;
  cancelAnimationFrame(rafid);
};
const loop = (drawingCallBack) => {
  looping = true;
  const play = (time) => {
    frame++;
    drawingCallBack(time);
    if (looping)
      rafid = requestAnimationFrame(play);
  };
  rafid = requestAnimationFrame(play);
};
const easing = {
  linear: (t) => t,
  cubicIn: (t) => t * t * t,
  cubicOut: (t) => 1 - (1 - t) * (1 - t) * (1 - t),
  cubicInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) * (-2 * t + 2) * (-2 * t + 2) / 2
};
const animate = (duration = 500, ease = "cubicOut", callback) => {
  let started = false, ended = false, start, timestamp, timeoutID, t, hasTarget, keys, froms, tos;
  return (target, prop) => {
    if (started)
      return;
    if (target && prop) {
      const prekeys = Object.keys(prop);
      keys = prekeys.reduce((acc, key) => !(key in target) || typeof target[key] !== "number" || typeof prop[key] !== "number" ? acc : acc.concat(key), []);
      if (keys.length) {
        hasTarget = true;
        froms = keys.map((key) => target[key]);
        tos = keys.map((key, i) => prop[key] - froms[i]);
      }
    }
    const calc = (time) => {
      timestamp = time ? Math.min(time - start, duration) : duration;
      if (!time || timestamp === duration)
        ended = true;
      t = timestamp / duration;
      t = easing[ease](t);
      hasTarget && keys.forEach((key, i) => target[key] = froms[i] + t * tos[i]);
      callback && callback(t, timestamp);
    };
    const end = () => {
      !ended && calc();
    };
    const play = (time) => {
      if (!started) {
        started = true;
        start = time;
        timestamp = time - start;
      }
      if (timestamp < duration && !ended) {
        clearTimeout(timeoutID);
        calc(time);
        timeoutID = setTimeout(end, duration - timestamp);
        requestAnimationFrame(play);
      } else {
        started = false;
        ended = false;
      }
    };
    requestAnimationFrame(play);
  };
};

export { CLOSE, PI, TAU, animate, arc, circle, clear, fill, font, frame, getcanvas, line, loop, looping, pxratio, rect, settext, shape, stop, stroke, text, vertex };