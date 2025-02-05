const {simulateMatch} = require('../controllers/controllers')
const express = require('express')
const router = express.Router()

router.route('/').post(simulateMatch)

module.exports = router