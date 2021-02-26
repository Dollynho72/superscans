const formidable = require('formidable');
const express = require("express");
const path = require('path');
const mega = require('megajs');
const fs = require("fs");
const app = express();

function checkHttps(req, res, next){
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/scan", (request, response) => {
  response.sendFile(__dirname + "/views/scan.html");
});

app.post('/scan', function (request, response) {
  try {
    const form = new formidable.IncomingForm()
    form.parse(request, function(err, fields, files) {
      let storage = new mega.Storage({email: 'dlysan.j.s.f@gmail.com', password: ''}, function(err) {
        fs.createReadStream(files.manga.path).pipe(storage.upload(files.manga.name))
        response.sendFile(__dirname +"/views/scan.html")
      })
    })
  } catch (error) {
    response.sendFile(__dirname +"/views/404.html")
  }
})

app.get('*', function(req, res){
  res.sendFile(__dirname + "/views/404.html")
});

const listener = app.listen(process.env.PORT, () => {
  console.log("🔎 Your Port: " + listener.address().port);
});