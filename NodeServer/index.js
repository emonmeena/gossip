// Noddse Server which will handle Socket.io

const io = require('socket.io')(8000) //on Port: 8000

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
        console.log(users[socket.id], newNameId)
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