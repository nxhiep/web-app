var express = require('express');
var app = express();
const path = require('path');
var POST = process.env.PORT || 3001;
var server = app.listen(POST, function() { // start server
  console.log('Server listening on port ' + server.address().port);
});
module.exports = app;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'));
})