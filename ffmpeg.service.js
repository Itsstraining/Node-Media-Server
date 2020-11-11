const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const { Writable, Duplex } = require("stream");
const { chunk } = require("lodash");
const { Stream, PassThrough } = require("stream").PassThrough;

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
    let command = ffmpeg(`${config.STREAM}${channel}/${channel}`)
      .addInputOption("-re")
      .addOutputOption("-f mp3")
      .addOutputOption(`-b:a 32k`);
    let ffstream = command.pipe();
    let writeStream = new Duplex();
    writeStream._read = () => {};
    writeStream._write = function (chunk, encoding, next) {
      next();
    };
    ffstream.pipe(writeStream);
    let conn = {
      channel: channel,
      stream: ffstream,
      command: command,
      passthrough: writeStream,
    };
    console.log("Listen to new connection");
    this.list.push(conn);
    return conn;
  }
  console.log("Listen to existed connection");
  let writeStream = new Duplex();
  writeStream._read = () => {};
  writeStream._write = function (chunk, encoding, next) {
    next();
  };
  this.list[connId].stream.pipe(writeStream);
  return {
    passthrough: writeStream,
    ...this.list[connId],
  };
};

FfmpegService.prototype.updateStream = function (channel, stream) {
  let connId = this.list.findIndex((conn) => conn.channel == channel);
  if (connId > -1) {
    this.list[connId] = {
      stream: stream,
      ...this.list[connId],
    };
  }
};

FfmpegService.prototype.removeChannel = function (channel) {
  let connId = this.list.findIndex((conn) => conn.channel == channel);
  if (connId > -1) {
    this.list.splice(connId, 1);
  }
  console.log(this.list);
};

module.exports = FfmpegService;
