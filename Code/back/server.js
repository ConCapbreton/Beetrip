const express = require('express')
const cors = require('cors')
const app = express()
const matchRoutes = require('./routes/matchRoutes')

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://letsplaytennis.netlify.app/'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],  
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.use(express.json())
  
app.use('/letsplaytennis', matchRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})