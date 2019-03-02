
exports.start = function (http) {
    const io = require('socket.io')(http);
    io.on('connection', function (socket) {
        socket.on('message', function (obj) {
            obj.username = "各个客户端均已改变，发起人：" + obj.username;
            io.emit('message', obj);
        });
    })
}