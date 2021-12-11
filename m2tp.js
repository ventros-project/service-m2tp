const process = require("process");
const supportedList = ["linux", "cygwin", "darwin"];
if (!supportedList.includes(process.platform)) {
  throw new Error(`"${process.platform}" platform is currently not supported`);
}

const ref = require("ref-napi");
const ffi = require("ffi-napi");

const receiveStation = require("./receiveStation");

const m2tp = ffi.Library("libm2tp-leader", {
  m2tp_startSend: [ref.types.uchar, [ref.types.uchar]],
  m2tp_startBroadcast: [ref.types.uchar, [ref.types.uchar]],
  m2tp_write: [ref.types.uchar, [ref.types.uchar]],
  m2tp_writeFinish: [ref.types.uchar, []],
  m2tp_writeFinishAsync: [ref.types.uchar, ["pointer", "pointer"]],
  m2tp_createTopic: [ref.types.void, [ref.types.CString, "pointer", "pointer"]],
  m2tp_subscribe: [ref.types.void, [ref.types.CString, "pointer"]],
  m2tp_getAddress: [ref.types.uchar, []],
  m2tp_isConnected: [ref.types.uchar, []],
  m2tp_getDeviceBrand: [ref.types.CString, []],
  m2tp_getDeviceVendor: [ref.types.CString, []],
  m2tp_getDeviceClass: [ref.types.CString, []],
  m2tp_setReceivedListener: [ref.types.void, ["pointer"]],

  // POSIX Specific
  m2tp_useSignal: [ref.types.void, [ref.types.int]],
  m2tp_useHook: [ref.types.void, [ref.types.ulong, "pointer", "pointer"]],
  m2tp_limitPacketSize: [ref.types.void, [ref.types.ulong]],
  m2tp_connectViaFile: [ref.types.bool, [ref.types.CString, ref.types.CString]],
  m2tp_connectViaPreconfigFile: [ref.types.bool, [ref.types.int, ref.types.CString]],
  m2tp_connectViaSocket: [ref.types.bool, [ref.types.int, ref.types.CString]],
  m2tp_connectViaCAN: [ref.types.bool, [ref.types.CString, ref.types.uint, ref.types.CString]],
  m2tp_startUDPServer: [ref.types.bool, [ref.types.CString, ref.types.ushort, ref.types.CString]],
  m2tp_disconnect: [ref.types.void, []],

  // Leader Specific
  m2tp_enableEchoTransmit: [ref.types.void, [ref.types.bool]],
  m2tp_getMemberDeviceClass: [ref.types.CString, [ref.types.uchar]],
  m2tp_getTopicName: [ref.types.CString, [ref.types.uchar]],
  m2tp_findMemberAddress: [ref.types.uchar, [ref.types.CString]],
  m2tp_findTopicID: [ref.types.uchar, [ref.types.CString]],
});

global.receiveListener = ffi.Callback(
  ref.types.void,
  [ref.types.uchar, ref.types.uchar, ref.types.CString],
  receiveStation.handler
);

m2tp.m2tp_setReceivedListener(global.receiveListener);

module.exports = m2tp;
