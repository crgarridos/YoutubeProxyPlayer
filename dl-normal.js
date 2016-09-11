var youtubedl = require('youtube-dl');
    
module.exports = function(youtubeUrl, args, options) {
    'use strict';
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
        return function(res){
            res.writeHead(200,{
                'Content-type': 'video/mp4'
            });
            video.pipe(res);
        }
}