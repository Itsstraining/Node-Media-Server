const express = require("express");

const app = express.Router();
const service = require("./ffmpeg.service");

app.get("/live/:key", (req, res) => {
  const { key } = req.params;

  console.log(key);

  let conn = service.instance().createAndGet(key);
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  let ffstream = conn.stream;

  ffstream.pipe(res);

  ffstream.on("close", function () {
    service.instance().removeChannel(conn.channel);
    console.log(`Close channel: ${conn.channel}`);
  });

  ffstream.on("error", function () {
    service.instance().removeChannel(conn.channel);
    console.log(`Error and remove channel: ${conn.channel}`);
  });
});

module.exports = app;
