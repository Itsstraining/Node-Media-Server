const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

function FfmpegService() {
  this.list = [];
}

const config = {
  STREAM: "rtmp://0.0.0.0/live",
};

FfmpegService.instance = function () {
  if (FfmpegService._instance == undefined) {
    FfmpegService._instance = new FfmpegService();
  }
  return FfmpegService._instance;
};

FfmpegService.prototype.createAndGet = function (channel) {
  let connId = this.list.findIndex((conn) => conn.channel == channel);
  if (connId == -1) {
    // Create new connection
    let command = ffmpeg(`${config.STREAM}/${channel}`)
      .addInputOption("-re")
      .addOutputOption("-f mp3");
    let ffstream = command.pipe();
    let conn = {
      channel: channel,
      stream: ffstream,
      command: command,
    };
    this.list.push(conn);
    return conn;
  }
  return this.list[connId];
};

module.exports = FfmpegService;
