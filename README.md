# FirstTsProject

Creating production build. Modify package.json
scripts [
"build": "webpack --config webpack.config.prod.js"
]

This points to the production webpack.config with settings to further minify bundle.js etc.
You then just need to serve the bundle.js, app.ts and index.html.
