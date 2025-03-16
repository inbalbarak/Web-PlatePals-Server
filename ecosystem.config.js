module.exports = {
  apps : [{
    name   : "Web-PlatePals-Server",
    script: "./dist/src/app.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
