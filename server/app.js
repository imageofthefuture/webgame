
// express 框架 
const app = require('express')();
const http=require('http').Server(app);

// 日志部分
const logger = require('log4js').getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");

// websocket 
require("./lib/websocket").start(http)

// 接口
require("./controllers/api").start(app,logger)



http.listen(3000, function(){
    console.log('listening on *:3000');
});