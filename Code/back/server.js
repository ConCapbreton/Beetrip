const express = require('express')
const cors = require('cors')
const app = express()
const matchRoutes = require('./routes/matchRoutes')

app.use(express.json())

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://letsplaytennis.netlify.app/'],
  credentials: true,
}))

app.options('*', cors());
  
app.use('/letsplaytennis', matchRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})