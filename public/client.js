var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var form2 = document.getElementById('form2');
var input2 = document.getElementById('input2');
var users = document.getElementById('users');
var typing = document.getElementById('typing');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

form2.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input2.value) {
        socket.emit('user-nickname', input2.value);
        input2.value = '';
    }
})

form.addEventListener('keypress', () => {
    if (input.value.length > 0) {
        socket.emit('typing', input.value);
    }
});


socket.on('chat message', function(msg) {
    typing.innerHTML = "";
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('users', (data) => {
    users.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        let item = document.createElement('li');
        item.textContent = data[i];
        users.appendChild(item);
    }
});

socket.on('load-messages', (msgs) => {
    for(let i = 0; i < msgs.length; i++){
        let item = document.createElement('li');
        item.textContent = msgs[i];
        messages.appendChild(item);
    }
});

socket.on('typing', (data) => {
    typing.innerHTML = data + ' is typing';
});