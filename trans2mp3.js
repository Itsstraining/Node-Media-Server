const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const app = new express();

const router = new express.Router();

const config = {
  STREAM: "rtmp://0.0.0.0/live",
};

router.get("/live/:key", (req, res) => {
  const { key } = req.params;

  let command = ffmpeg(`${config.STREAM}${key}/${key}`)
    .addInputOption("-re")
    .addOutputOption("-f mp3");

  let ffstream = command.pipe();
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  ffstream.on("data", function (chunk) {
    res.write(chunk);
  });
  req.on("close", () => {
    console.log("Kill ffmpeg");
    try {
      command.kill("1");
      ffstream.destroy();
    } catch (e) {}
  });
});

module.exports = router;
