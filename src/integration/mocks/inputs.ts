const control = document.createElement("div")
document.body.prepend(control)

const radiusvalue = document.createElement("span")
control.appendChild(radiusvalue)

const radiusrange = document.createElement("input")
radiusrange.type = "range"
radiusrange.min = "0"
radiusrange.max = "500"
control.appendChild(radiusrange)

export { control, radiusrange, radiusvalue }