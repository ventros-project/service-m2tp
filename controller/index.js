/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
function index(request, response) {
  response.status(200).json([
    {
      path: "/",
      method: "GET",
      description: "List all available commands",
    },
    {
      path: "/device",
      method: "GET",
      description: "List all connected devices",
    },
    {
      path: "/device/<class>",
      method: "GET",
      description: "Get last data from a device with that class name",
    },
    {
      path: "/device/<class>",
      method: "POST",
      description: "Send data to a device with that class name",
    },
    {
      path: "/topic",
      method: "GET",
      description: "List all available topics",
    },
    {
      path: "/topic/<topic_name>",
      method: "GET",
      description: "Get last data from that topic",
    },
    {
      path: "/topic/<topic_name>",
      method: "POST",
      description: "Broadcast to that topic",
    },
  ]);
}

module.exports = { index };
