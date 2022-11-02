import express from 'express'
const app = express();
import colors from 'colors';
import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
const __dirname = path.resolve()
import {createServer} from 'http';
import {Server} from 'socket.io';


// Create server by raw node js
const httpServer = createServer(app)

// Socket server init
const io = new Server(httpServer)

// Create a connection to client
io.on('connection', (socket) => {
    console.log(`Client connected successfull`.bgGreen.black);

    // socket.on('disconnect', () => {
    //     console.log(`Client disconnected`.bgRed.black);
    // })

    socket.on('chat', ({name, photo, message}) => {
        
        let oldData = JSON.parse(readFileSync(path.join(__dirname, 'db/data.json')).toString())
        oldData.push({name, photo, message})
        writeFileSync(path.join(__dirname, 'db/data.json'), JSON.stringify(oldData))

        let latestData = JSON.parse(readFileSync(path.join(__dirname, 'db/data.json')).toString())
        io.sockets.emit('latestData', latestData)

    })
})


app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

httpServer.listen(5050, () => {
    console.log(`server is running on port : 5050`.bgCyan.red);
})