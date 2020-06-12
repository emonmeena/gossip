// Noddse Server which will handle Socket.io

const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server) // on our http server

// set Static folder
app.use(express.static(path.join(__dirname, 'Client')));  //we used this because we want complete folder not just index.html 

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Express.js server on port ${PORT} started...`));  

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        const newNameId = socket.id;
        socket.broadcast.emit('user-joined', name)
        socket.broadcast.emit('user-show', name)    
        socket.broadcast.emit('other-users-show', newNameId)
    })

    socket.on('show-existing-users', newNameId =>{
        socket.broadcast.to(newNameId).emit('user-show', users[socket.id])
    })

    socket.on('send', message=>{
        socket.broadcast.emit('recieve', {message: message, name: users[socket.id]})
    })
 
    socket.on('disconnect', message=>{
        socket.broadcast.emit('leave', users[socket.id])
        socket.broadcast.emit('user-offline', users[socket.id])
        delete users[socket.id]
    })

})