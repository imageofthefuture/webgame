const io = require('socket.io')(http);
exports.start = function (http) {
    io.on('connection', function (socket) {
        socket.on('message', function (obj) {
            obj.username = "fuwuqi:" + obj.username;
            io.emit('message', obj);
        });
    })
}