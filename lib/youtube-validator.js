var _ 	= 	require('underscore'),
http 	=	require('http')

//adapter for IDs
function validateVideoID(id, clbk) {
  validateUrl('www.youtube.com/watch?v='+id, clbk)
}

function validateUrl(url, clbk) {
	var videoID = '/'+_.last(url.split('/'))
	var urlLowerCase = url.toLowerCase()
	var urlSpltLowerCase = urlLowerCase.split('/')

	if(_.contains(urlSpltLowerCase, 'youtube.com') 
    || _.contains(urlSpltLowerCase, 'www.youtube.com')) {
		var begin = urlLowerCase.replace('youtube.com','')
      .replace(videoID.toLowerCase(),'')
    if(!(begin== 'www.' || begin== 'http://www.' || begin== '' || begin== 'https://www.')){
			clbk(null, 'error: URL malformed')
			return
		}
	} else {
		clbk(null, 'error: URL malformed')
		return
	}

	if(videoID=='' || videoID=='/') {
		clbk(null, 'error: URL malformed')
		return		
	}

  youtubeRequest(videoID, function(res, err) {
    clbk(res, err)
  })
}

function youtubeRequest(videoID, clbk) {
  videoID = videoID.replace('/watch?v=', '');
  var req = http.get('http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + escape(videoID) + '&format=json', function (res) {
    res.setEncoding('utf8');

    if (res.statusCode == '404' || res.statusCode == '302') {
      clbk(null, 'error: youtube video does not exist')

    } else {
      clbk(undefined, null)
    }

    req.on('error', function (e) {
      clbk(null, 'error: something occured')
    })

  });
  req.shouldKeepAlive = false;
  req.end();

}

exports.validateUrl = validateUrl
exports.validateVideoID = validateVideoID
