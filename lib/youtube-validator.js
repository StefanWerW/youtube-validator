'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateVideoID = validateVideoID;
exports.validateUrl = validateUrl;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//adapter for IDs
function validateVideoID(id) {
  return validateUrl('www.youtube.com/watch?v=' + id);
}

function validateUrl(url) {
  var videoID = '/' + _lodash2.default.last(url.split('/'));
  var urlLowerCase = url.toLowerCase();
  var urlSpltLowerCase = urlLowerCase.split('/');

  return new Promise(function (fulfill, reject) {

    if (_lodash2.default.includes(urlSpltLowerCase, 'youtube.com') || _lodash2.default.includes(urlSpltLowerCase, 'www.youtube.com')) {
      var begin = urlLowerCase.replace('youtube.com', '').replace(videoID.toLowerCase(), '');
      if (!(begin == 'www.' || begin == 'http://www.' || begin == '' || begin == 'https://www.')) {
        reject('error: URL malformed');
      }
    } else {
      reject('error: URL malformed');
    }

    if (videoID == '' || videoID == '/') {
      reject('error: URL malformed');
    }

    fulfill(videoID);
  }).then(function (videoID) {
    return youtubeRequest(videoID);
  });
}

function youtubeRequest(videoID) {
  var config = {
    method: 'GET',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' }
  };
  videoID = videoID.replace('/watch?v=', '');
  return fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + escape(videoID) + '&format=json', config).then(function (res) {
    if (res.statusCode == '404' || res.statusCode == '302') {
      throw 'error: youtube video does not exist';
    } else {
      return videoID;
    }
  }).catch(function (e) {
    throw 'error: something occured', e;
  });
}