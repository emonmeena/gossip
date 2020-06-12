const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");
const userContainer = document.querySelector(".container2")

const sendTune = new Audio('send.mp3');
const recieveTune = new Audio('recieve.mp3');

// JS function to inform other users about recent connection
const append = (message, position)=>{
const messageElement = document.createElement('div');
messageElement.innerHTML = message;
messageElement.classList.add('message');
messageElement.classList.add(position);
messageContainer.append(messageElement);
messageContainer.scrollTop = messageContainer.scrollHeight;
if(position == 'left'){
    recieveTune.play();
    }
else sendTune.play();
}

//  when we click send button this function sends mssgs
form.addEventListener('submit', (e)=>{
    e.preventDefault(); //prevent reloading
    const message = messageInput.value; 
    append(`you: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ""
    // Scroll down
  messageContainer.scrollTop = messageContainer.scrollHeight;
})

// JS function to add user in the "Online-list"
const appendUser = (name)=>{
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.innerHTML = name;
    userElement.id = name;
    userContainer.append(userElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
    }

const appendExistingUser=(newNameId)=>{
    socket.emit('show-existing-users', newNameId)
}

const removeUser = (name)=>{
    const user = document.getElementById(name)
    user.remove()
}

    // Client Interface
const name = prompt("Enter your name: ");
document.getElementById('profile').innerHTML = "Your Public Name: "+name;
socket.emit('new-user-joined', name); //sends name to the server

socket.on('user-joined',name=>{
 append(`${name} joined the Room`, 'right');
})

socket.on('user-show', name=>{
    appendUser(name);
})

socket.on('other-users-show', newNameId=>{
    appendExistingUser(newNameId)
})

socket.on('recieve', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('user-offline', name=>{
    removeUser(name)
})

socket.on('leave', name =>{
    append(`${name} left`, 'right')
})

