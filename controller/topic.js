/** @type {import('../m2tp')} */
let m2tp = undefined;

function setM2TP(instance) {
  m2tp = instance;
}

/** @type {import('../receiveStation')} */
let receiveStation = undefined;

function setReceiveStation(instance) {
  receiveStation = instance;
}

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
function index(request, response) {
  const result = [];
  for (let i = 1; i < 128; i++) {
    const eachClass = m2tp.m2tp_getMemberDeviceClass(i);
    if (eachClass) {
      result.push({
        address: i,
        class: eachClass,
      });
    }
  }
  response.status(200).json(result);
}

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
function read(request, response) {
  const topicName = request.params["name"];

  const topicID = m2tp.m2tp_findTopicID(topicName);
  if (!topicID) {
    response.status(404).send();
    return;
  }

  const lastData = receiveStation.get(topicID);
  if (lastData) {
    response.header("Content-Type", "application/octet-stream");
    response.status(200).send(lastData);
  } else {
    response.status(204).send();
  }
}

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
function write(request, response) {
  const topicName = request.params["name"];

  const topicID = m2tp.m2tp_findTopicID(topicName);
  if (!topicID) {
    response.status(404).send();
    return;
  }

  m2tp.m2tp_startSend(topicID);

  request.on("data", (chunk) => {
    for (let i = 0; i < chunk.length; i++) {
      m2tp.m2tp_write(chunk[i]);
    }
  });

  request.on("end", () => {
    m2tp.m2tp_writeFinish();
    response.status(200).send();
  });
}

module.exports = { setM2TP, setReceiveStation, index, read, write };
