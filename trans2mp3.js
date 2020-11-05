const express = require("express");

const app = new express();
const service = require("./ffmpeg.service");

app.get("/live/:key", (req, res) => {
  const { key } = req.params;

  let conn = service.instance().createAndGet(key);
  res.set("content-type", "audio/mpeg");
  res.set("accept-ranges", "bytes");

  let ffstream = conn.stream;

  ffstream.on("data", function (chunk) {
    res.write(chunk);
  });
});

module.exports = app;
