const {analysePoints} = require('../services/matchService')

function simulateMatch(req, res) {
  const pointsArray = req.body.data
  const result = analysePoints(pointsArray)
  res.status(200).json({success:true, data:result})
}

module.exports = { simulateMatch }