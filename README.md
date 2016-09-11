# YoutubeProxyPlayer
A simple youtube audio player proxy

Small website that allows plays youtube videos when you are behind a proxy. 
You deploy this server in a external to the proxy's network ant voilà. 

### Routes:
`search/?q=<text to find>[&pageToken=<next or prev page id>][&disableReduce[=<false|.*>]]`
* *disableReduce* may be setted to show the original google's json 
