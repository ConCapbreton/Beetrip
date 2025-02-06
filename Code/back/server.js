const express = require('express')
const cors = require('cors')
const app = express()
const matchRoutes = require('./routes/matchRoutes')

app.use(express.json())


app.use(cors())
// app.use((_req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
//   res.setHeader("Content-Type", "application/json")
//   next()
// })
  
app.use('/letsplaytennis', matchRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})