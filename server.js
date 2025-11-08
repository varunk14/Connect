const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Store connected users
const users = new Map()
// Store message history (in-memory, persists during server runtime)
const messages = []
const MAX_MESSAGES = 100 // Keep last 100 messages to prevent memory issues
let messageCounter = 0 // Counter to ensure unique message IDs

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (username) => {
      users.set(socket.id, username)
      socket.broadcast.emit('userJoined', { username })
      
      // Send current user list to the new user
      const userList = Array.from(users.values())
      socket.emit('userList', userList)
      
      // Send message history to the new user
      if (messages.length > 0) {
        socket.emit('messageHistory', messages)
      }
      
      // Broadcast updated user list to all users
      io.emit('userList', userList)
    })

    socket.on('message', (data) => {
      // Generate unique message ID to prevent conflicts
      messageCounter++
      const message = {
        id: `${socket.id}-${Date.now()}-${messageCounter}-${Math.random().toString(36).substr(2, 9)}`,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp || Date.now(),
      }
      
      // Store message in history
      messages.push(message)
      
      // Keep only last MAX_MESSAGES messages
      if (messages.length > MAX_MESSAGES) {
        messages.shift() // Remove oldest message
      }
      
      // Broadcast to all connected clients
      io.emit('message', message)
    })

    socket.on('disconnect', () => {
      const username = users.get(socket.id)
      if (username) {
        users.delete(socket.id)
        socket.broadcast.emit('userLeft', { username })
        
        // Broadcast updated user list
        const userList = Array.from(users.values())
        io.emit('userList', userList)
      }
      console.log('User disconnected:', socket.id)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${port}`)
    })
})

