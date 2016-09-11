# YoutubeProxyPlayer
A simple youtube audio player proxy

Small website that allows plays youtube videos when you are behind a proxy. 
You deploy this server in a external to the proxy's network ant voilà. 

### Routes:

`watch/?id=<the youtube video's id>[&lucky[=<false|.*>]]`
* *lucky* sometimes the network admin doesn't block the *.googlevideo.com domain, 
then we have a chance to insert an iframe with this video without streaming it. If it fails retourn the normal method

`search/?q=<text to find>[&pageToken=<next or prev page id>][&disableReduce[=<false|.*>]]`
* *disableReduce* may be setted to show the original google's json 

`suggest/?q=<text to prdict results>`