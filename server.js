var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('./mime');
// some utility method designed to help handle range request
var rge = require('./range');
                   
http.createServer(function(request, response) {
    // this is the file name
    var fname = url.parse(request.url).pathname.substring(1);
	if(!fname) {
		response.writeHead(404);
		response.write("Not Found!");
		response.end();
		return;
	}
	// do not response the favicon.ico file request
    if (fname == 'favicon.ico') {
        response.end();
        return ;
    }
    var filepath = 'files/' + fname;
    var suffix = fname.substring(fname.indexOf('.') + 1);
    var type = mime.getMimeType(suffix);
    var stat = fs.statSync(filepath);
    console.log(request.headers);
	// log file size
	console.log('File Size: ' + stat.size);
    // check whether the header has the Range field
    var range = request.headers['range'];
    if (range) {
    	console.log('Range Download');
    	// partial download
    	range = rge.parseRange(range, stat.size);
    	console.log(range);
    	// assume the format is right, no error handling
    	response.writeHead(206, {'Content-Type': type,
    		'Conteng-Range': 'bytes ' + range.start + '-'
    		+ range.end + '/' + stat.size,
    		'Content-Length': range.start - range.end + 1});
    	fs.createReadStream(filepath, range).pipe(response);
    } else {
    	console.log('Full Download');
    	response.writeHead(200, {'Content-Type': type, 
        	'Content-Length': stat.size,
    		});
    	// send the file
    	fs.createReadStream(filepath).pipe(response);
    }
}).listen(9090);