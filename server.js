const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];
let history = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    loadUsers = () => {
        io.sockets.emit('users', users);
    }

    // on connection
    io.emit('chat message', "user connected"); 
    socket.emit('load-messages', history);
    loadUsers();

    socket.on('chat message', (msg) => {
        if(socket.nickname){
            history.push(socket.nickname + ': ' + msg);
            io.emit('chat message', socket.nickname + ': ' + msg);
        }
        else {
            history.push('anon: ' + msg);
            io.emit('chat message', 'anon: ' + msg);
        }
        
    });

    socket.on('user-nickname', (uNickname) => {
        socket.nickname = uNickname;
        users.push(socket.nickname);
        loadUsers();
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (socket.nickname) ? socket.nickname : 'anon');
    });

    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.nickname), 1);
        loadUsers();
        io.emit('chat message', socket.nickname + ' disconnected');
    });
});

server.listen(9999, () => {
    console.log('listening on *:9999');
});