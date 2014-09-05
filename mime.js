
var mimetbl = {
	'pdf': 'application/pdf',
	'mkv': 'video/x-matroska',
	'png': 'image/png',
	'ppt': 'application/vnd.ms-powerpoint',
    'sql': 'application/x-sql',
	'zip': 'application/zip'
};

exports.getMimeType = function (suffix) {
	return mimetbl[suffix];
};