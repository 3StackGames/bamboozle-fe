'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function validatePayload(payload) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (arg) {
    if (!payload[arg]) throw Error('payload does not have "' + arg + '" field');
  });
}

exports.validatePayload = validatePayload;