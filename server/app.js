var express = require('express');
var app = express(); 
var http=require('http').Server(app);
var io=require('socket.io')(http);
var bodyParser = require('body-parser');
var HttpResult = require('./HttpResult');
var fileManger = require('./fileManager');
var databaseManger = require('./databaseManager');
var datasource = "file"; // file or mysql
var logger = require('log4js'); 
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");

// 跨域支持
app.all('*', (req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    logger.debug("req","res"); 
    next();
});

app.get('/getVeryCode', bodyParser.json(), function (req, res) {
    var httpResult = new HttpResult();
    //var telPhone = req.query.num;    
    if (!checkSign(req, res)) {
        return
    }
    var codeNum = Math.floor(Math.random() * 9000) + 1000;
    httpResult.code = 1;
    httpResult.data = codeNum;
    res.send(httpResult);
})
app.get('/users', bodyParser.json(), function (req, res) {
    if (!checkSign(req, res)) {
        return
    }
    if (datasource == "file") {
        fileManger.getItemList(req, res);
    } else {
        databaseManger.getItemList(req, res);
    }
})

app.post('/addUser', bodyParser.json(), function (req, res) {
    if (!checkSign(req, res)) {
        return
    }
    if (datasource == "file") {
        fileManger.addItem(req, res);
    } else {
        databaseManger.addItem(req, res);
    }
})

app.get('/page/:pageindex/:pagesize', function (req, res) {
    if (!checkSign(req, res)) {
        return
    }
    if (datasource == "file") {
        fileManger.setPagination(req, res);
    } else {
        databaseManger.setPagination(req, res);
    }
})

// md5加密
function checkSign(req, res) {
    var appSecret = '!Q@W#E$R';
    var sign;
    var md5Conent
    if (req.method == 'GET') {
        sign = req.headers.sign;
        md5Conent = JSON.stringify(req.query) + "|" + appSecret;
    } else {
        sign = req.body.headers.sign;
        md5Conent = JSON.stringify(req.body.params) + "|" + appSecret;
    }
    if (sign == sign) {
        return true;
    }
    var httpResult = new HttpResult();
    httpResult.code = -3;
    httpResult.description = '身份认证失败！';
    res.send(httpResult);
    return false;
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});