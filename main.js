const process = require("process");
const child_process = require("child_process");
const errno = require("errno");

// Put .env file content into process.env
require("dotenv").config();

// Usage: node . <port_number>
if (process.argv.length < 3) {
  console.error("Missing first argument as port number");
  process.exit(errno.code.EINVAL.errno);
}

// Validate port number
const port = Number(process.argv[2]);
if (!Number.isInteger(port)) {
  console.error("Port number is not a valid number");
  process.exit(errno.code.EINVAL.errno);
}

let lastError = "";

/**
 * This function handles messages from auto configuration
 *
 * @param {child_process.ExecException} error
 * @param {string} stdout
 * @param {string} stderr
 */
function commandCallback(error, stdout, stderr) {
  if (stdout) {
    console.log("[kernel]", stdout);
  }

  if (error) {
    console.error("[kernel]", error.message);
    if (lastError) lastError += "\n";
    lastError += "[kernel] " + error.message;
  } else if (stderr) {
    console.error("[kernel]", stderr);
    if (lastError) lastError += "\n";
    lastError += "[kernel] " + stderr;
  }
}

const interfaceName = process.env.INTERFACE_NAME || "";
const interfaceType = (process.env.INTERFACE_TYPE || "").toLowerCase();

let returnCode = 0;

// Check if currently using CAN Bus and CAN_BITRATE is inside .env file
if (interfaceName && interfaceType === "can" && !isNaN(process.env.CAN_BITRATE)) {
  child_process.exec(`ip link set ${interfaceName} down`, commandCallback);

  returnCode = child_process.exec(
    `ip link set ${interfaceName} type can bitrate ${process.env.CAN_BITRATE}`,
    commandCallback
  ).exitCode;

  returnCode = child_process.exec(`ip link set ${interfaceName} up`, commandCallback).exitCode;
}

// Attempt to start M2TP via UDP or CAN Bus
const m2tp = require("./m2tp");
let success = false;
if (returnCode === 0) {
  const deviceClass = process.env.DEVICE_CLASS || "VentrOS";
  switch (interfaceType) {
    case "":
    case "udp":
      const udpHost = process.env.UDP_HOST || "127.0.0.1";
      const udpPort = isNaN(process.env.UDP_PORT) ? 3030 : Number(process.env.UDP_PORT);
      success = m2tp.m2tp_startUDPServer(udpHost, udpPort, deviceClass);
      break;
    case "can":
      success = m2tp.m2tp_connectViaCAN(interfaceName, 0, deviceClass);
      break;
    default:
      console.error("INTERFACE_TYPE inside .env file is invalid!");
      process.exit(errno.code.EINVAL.errno);
  }
}

const express = require("express");
const service = express();
const receiveStation = require("./receiveStation");
const fatalErrorMiddleware = require("./middleware/fatalError");
const corsMiddleware = require("./middleware/cors");
const restMiddleware = require("./middleware/rest");
const error_405 = require("./controller/error_405");

function cleanup() {
  console.log("Disconnecting...");
  if (success) {
    m2tp.m2tp_disconnect();
  }
  process.exit(returnCode);
}

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGHUP", cleanup);

service.use(corsMiddleware);

if (!success) {
  // Failure-mode service:
  service.all("*", (request, response) => {
    if (lastError) {
      response.status(500).json({
        error: lastError,
      });
    } else {
      response.status(502).json({
        error: "Cannot connect to M2TP network",
      });
    }
  });
  service.listen(port, () => {
    console.log("WARN: M2TP service is running but non functional");
  });
} else {
  // Normal-mode service:
  const indexController = require("./controller/index");
  service.get("/", restMiddleware, indexController.index);
  service.all("/", error_405("GET"));

  const deviceController = require("./controller/device");
  deviceController.setM2TP(m2tp);
  deviceController.setReceiveStation(receiveStation);
  service.get("/device", restMiddleware, deviceController.index);
  service.all("/device", error_405("GET"));
  service.get("/device/:class", deviceController.read);
  service.post("/device/:class", deviceController.write);
  service.all("/device/:class", error_405("GET, POST"));

  const topicController = require("./controller/topic");
  topicController.setM2TP(m2tp);
  topicController.setReceiveStation(receiveStation);
  service.get("/topic", restMiddleware, topicController.index);
  service.all("/topic", error_405("GET"));
  service.get("/topic/:name", topicController.read);
  service.post("/topic/:name", topicController.write);
  service.all("/topic/:name", error_405("GET, POST"));

  service.all("*", restMiddleware, require("./controller/error_404"));

  service.use(fatalErrorMiddleware);

  service.listen(port, () => {
    console.log("Ready! Listening on port", port);
  });
}
