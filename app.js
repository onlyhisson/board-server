//var compression = require('compression')
var express = require('express');
var cors = require('cors');
var app = express();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var config = require('./config/config.json');

var index = require('./routes/index');
var auth = require('./routes/auth');
var board = require('./routes/board');

app.use(cors())
app.use(bodyParser.json());	// json 으로 요청시 받을 수 있게 한다.

app.use('/', index);
app.use('/auth', auth);
app.use('/board', board);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
	next();
});

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));	// for parsing application/json
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // for parsing application/x-www-form-urlencoded

app.set('port', process.env.PORT || config.port);
app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + config.port);
});
