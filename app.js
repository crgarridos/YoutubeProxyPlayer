var express = require('express');
var request = require('request');
var app = express();

var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyDAVVYxMm8lnLVMg0KbTfYIy4aRswzjgzo');

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/watch', function (req, res) {
    
    var videoId = req.query.id;
    var youtubeUrl = 'http://www.youtube.com/watch?v=' + videoId;
    //if is setted, try to recover first the googlevideo internal url (not youtube domain)
    var tryWithLucky = req.query.lucky !== undefined
                        && req.query.lucky != "false";
        
    // Optional arguments passed to youtube-dl. 
    var args = ['--format=' + (tryWithLucky ? 'best' : 'worst')];
    
    // Additional options can be given for calling `child_process.execFile()`. 
    var options = { cwd: __dirname };
                        
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    
    if(tryWithLucky){
        youtubedl.getInfo(youtubeUrl, args, options, 
            function(error, info){
                res.send("<style>body{margin:0;padding:0}</style>"
                        + "<iframe style='width:100%;height:100%;margin:0' frameborder='0' allowfullscreen='allowfullscreen' "
                        + "src='" + info.url +"'/>");
            })
    } else {
        var video = youtubedl(youtubeUrl, args, options);
        
        // Will be called when the download starts. 
        video.on('info', function(info) {
            console.log('Download started');
            console.log('filename: ' + info._filename);
            console.log('size: ' + info.size);
            console.log('ext: ' + info.ext);
            if(false && file === null){
                file = fs.createWriteStream(videoId+".mp4")
                video.pipe(file);
            }
        });
        video.on('end', function() {
            console.log('finished downloading!');
            //res.sendFile(file.path, { root: __dirname })
        });
        res.writeHead(200,{
            'Content-type': 'video/mp4'
        });
        video.pipe(res);
    }
});


app.get('/search', function (req, res) {
    var disableReduce = req.query.disableReduce !== undefined
                        && req.query.disableReduce != "false";
    youTube.addParam("pageToken", req.query.pageToken)
    youTube.search({ q: req.query.q}, 20, function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        res.send(disableReduce ? result : reduceSearchJson(result));
    }
    });
});


app.get('/suggest', function (req, res) {
	request('http://suggestqueries.google.com/complete/search?'
            + 'hl=en&ds=yt&client=youtube&hjson=t&cp=1&alt=json'
            + '&q=' + req.query.q.replace(/\s+/g,"+"),
            function(error,d_res,d_content){
                if (error && d_res.statusCode !== 200) {
                    console.log(error);
                }
                else {
                    try {
                        var json = eval(d_content);
                        var mid = json[1];
                        var suggest = [];
                        for(var i in mid)
                            suggest[i] = mid[i][0];
                        res.send(suggest);//JSON.stringify(d_content, null, 2));
                    } catch(ex){
                        res.send("Error on suggest api");//JSON.stringify(d_content, null, 2));
                    }
                }                
            })
});


app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
    console.log(__dirname);
});

function reduceSearchJson(json){
    var reduced = {};
    reduced.prevPageToken = json.prevPageToken;
    reduced.nextPageToken = json.nextPageToken;
    reduced.items = [];
    for(var i in json.items){
        var oldItem = json.items[i];
        var newItem = {};
        newItem.id = oldItem.id.videoId;
        newItem.title = oldItem.snippet.title;
        reduced.items[i] = newItem;
    }
    return reduced;
}