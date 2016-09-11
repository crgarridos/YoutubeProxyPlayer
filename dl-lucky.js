
var request = require('request');
var youtubedl = require('youtube-dl');

module.exports = function (youtubeUrl, args, options) {
    return function (res) {
        youtubedl.getInfo(youtubeUrl, args, options, 
            function(error, info){
                request({method: 'HEAD',url: info.url}, function (error, response, body) {
                    console.log("veryfing lucky")
                    if (!error && response.statusCode == 200) {
                        res.send("<style>body{margin:0;padding:0}</style>"
                            + "<iframe style='width:100%;height:100%;margin:0' frameborder='0' allowfullscreen='allowfullscreen' "
                            + "src='" + info.url +"'/>");
                    } else {
                        console.log("bad lucky :(")
                        dl_normal(youtubeUrl, args, options)(res);
                    }
                });
            })
    }
}