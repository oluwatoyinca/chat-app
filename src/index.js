const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
//server is created so it can be passed into seocketio() as we can't use the one express creates
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    //message on successful connection
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')
    //below code is used to send the message (or emit message) to every connection exceopt this particuar connection/socket.
    //i'e sending to io except socket
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (mess, callback) => {
        const filter = new Filter()

        if(filter.isProfane(mess)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', mess)
        callback()
    })

    socket.on('sendLocation', ({latitude, longitude} = {}, callback) => {
        const loc = `https://google.com/maps?q=${longitude},${latitude}`
        io.emit('message', loc)
        callback()
    })

    //below code runs when a client/connection/socket is disconnected
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

//sever.listen is used instead of app.listen to enable our app use socket.io
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})