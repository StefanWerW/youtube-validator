'use strict'

import  _ 	from 'lodash'
import http from 'http'

//adapter for IDs
export function validateVideoID(id) {
  return validateUrl('www.youtube.com/watch?v='+id)
}

export function validateUrl(url) {
	var videoID = '/'+_.last(url.split('/'))
	var urlLowerCase = url.toLowerCase()
	var urlSpltLowerCase = urlLowerCase.split('/')

  return new Promise((fulfill, reject) => {

    if(_.includes(urlSpltLowerCase, 'youtube.com')
      || _.includes(urlSpltLowerCase, 'www.youtube.com')) {
  		var begin = urlLowerCase.replace('youtube.com','')
        .replace(videoID.toLowerCase(),'')
      if(!(begin == 'www.' || begin == 'http://www.' || begin == '' || begin == 'https://www.')){
  			reject('error: URL malformed')
  		}
  	} else {
  		reject('error: URL malformed')
  	}

  	if(videoID == '' || videoID == '/') {
  		reject('error: URL malformed')
  	}

    fulfill(videoID)
  }).then(function(videoID) {
    return youtubeRequest(videoID)
  })
}

function youtubeRequest(videoID) {
  let config = {
    method: 'GET',
    mode: 'no-cors',
    headers: { 'Content-Type':'application/json' },
  }
  videoID = videoID.replace('/watch?v=', '')
  return fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + escape(videoID) + '&format=json', config)
  .then(res => {
    if (res.statusCode == '404' || res.statusCode == '302') {
      throw ('error: youtube video does not exist')
    } else {
      return response.json()
    }
  }).catch(e => {
      throw('error: something occured', e)
  })
}
