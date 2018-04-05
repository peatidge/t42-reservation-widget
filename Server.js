var express = require("express");
var app     = express();
var path    = require("path");

app.mime.type['js'] = 'text/javascript';

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/t42-widget.js',function(req,res){
  res.sendFile(path.join(__dirname+'/t42-widget.js'));
  //__dirname : It will resolve to your project folder.
});

app.listen(3000);

console.log("Running at Port 3000");