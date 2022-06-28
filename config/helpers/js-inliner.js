import path from "path"

export const inliner = (template) => ({
  name: "jsInliner",
  generateBundle(options, bundle) {
    const file = path.parse(options.file).base;
    bundle[file].code = template.replace(/%script%/, bundle[file].code)
  }
})