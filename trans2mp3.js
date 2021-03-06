const express = require("express");

const app = express.Router();
const service = require("./ffmpeg.service");
const { Readable, PassThrough } = require("stream");

app.get("/live/:key", (req, res) => {
  const { key } = req.params;

  console.log(key);

  let conn = service.instance().createAndGet(key);
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  let ffstream = conn.stream;
  conn.callbacks.push((chunk) => {
    res.write(chunk);
  });
});

module.exports = app;
