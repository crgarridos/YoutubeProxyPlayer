var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyDAVVYxMm8lnLVMg0KbTfYIy4aRswzjgzo');

youTube.search('noviembre', 2, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});