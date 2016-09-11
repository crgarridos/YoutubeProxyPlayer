const PORT = 1313;

var express = require('express');
var request = require('request');
var YouTube = require('youtube-node');
var dl_normal = require('./dl-normal');
var dl_lucky = require('./dl-lucky');
var app = express();


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
                        
    if(tryWithLucky){
        dl_lucky(youtubeUrl, args, options)(res)
    } else {
        dl_normal(youtubeUrl, args, options)(res);
    }
});


app.get('/search', function (req, res) {
    var disableReduce = req.query.disableReduce !== undefined
                        && req.query.disableReduce != "false";
    youTube.addParam("pageToken", req.query.pageToken)
    youTube.search(req.query.q, 20, function(error, result) {
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


app.listen(PORT, function () {
    console.log('Example app listening on port '+PORT+'!');
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