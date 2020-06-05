const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");

const sendTune = new Audio('send.mp3');
const recieveTune = new Audio('recieve.mp3');

const append = (message, position)=>{
const messageElement = document.createElement('div');
messageElement.innerHTML = message;
messageElement.classList.add('message');
messageElement.classList.add(position);
messageContainer.append(messageElement);
if(position == 'left'){
    recieveTune.play();
}
else sendTune.play();
}

form.addEventListener('submit', (e)=>{
    e.preventDefault(); //prevent reloading
    const message = messageInput.value; 
    append(`you: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ""
})

const name = prompt("Enter your name to Join the Room: ");
socket.emit('new-user-joined', name);

socket.on('user-joined',name=>{
 append(`${name} joined the Room`, 'right');
})

socket.on('recieve', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('leave', name =>{
    append(`${name} left`, 'right')
})
