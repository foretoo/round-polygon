import path from "path"

const template =
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>round-polygon demo</title>
  </head>
  <body>
    <script>
    %script%
    </script>
  </body>
</html>`

export const inliner = () => ({
  name: "jsInliner",
  generateBundle(options, bundle) {
    const file = path.parse(options.file).base;
    bundle[file].code = template.replace(/%script%/, bundle[file].code)
  }
})