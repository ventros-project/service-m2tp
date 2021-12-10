/** @type {Map<number,string>} */
const messageMap = new Map();

/**
 * @param {number} channelID
 * @param {number} size
 * @param {string} content
 * @returns {void}
 */
function handler(channelID, size, content) {
  messageMap.set(channelID, content.substr(0, size));
}

/**
 * @param {number} channelID
 * @returns {string|undefined}
 */
function get(channelID) {
  if (messageMap.has(channelID)) {
    const result = messageMap.get(channelID);
    messageMap.delete(channelID);
    return result;
  } else {
    return undefined;
  }
}

module.exports = { handler, get };
