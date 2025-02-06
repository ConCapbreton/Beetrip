function analysePoints(pointsArray) {
    
  //CONSTANTS
  let playerOnePoint = 0
  let playerTwoPoint = 0

  let playerOneTiebreakPoint = 0 
  let playerTwoTiebreakPoint = 0 

  let playerOneGameCount = 0
  let playerTwoGameCount = 0

  let playerOneSetCount = 0
  let playerTwoSetCount = 0

  let tiebreak = false

  const resultArray = []

  // RESET / CHECKER and RESULTS FUNCTIONS
  function reset() {
    playerOnePoint = 0
    playerTwoPoint = 0
    
    playerOneTiebreakPoint = 0 
    playerTwoTiebreakPoint = 0 

    playerOneGameCount = 0
    playerTwoGameCount = 0

    tiebreak = false
  }

  function pointsChecker() {
    if (playerOnePoint >= 4 && playerOnePoint - playerTwoPoint >= 2) {
      playerOneGameCount++
      playerOnePoint = 0
      playerTwoPoint = 0
      return true
    } else if (playerTwoPoint >= 4 && playerTwoPoint - playerOnePoint >= 2) {
      playerTwoGameCount++
      playerOnePoint = 0
      playerTwoPoint = 0
      return true
    }
    return false
  }

  function checkSetWinner() {
    if (tiebreak) {
      if (playerOneTiebreakPoint >= 7 && playerOneTiebreakPoint - playerTwoTiebreakPoint >= 2) {
        playerOneSetCount++
        prepareResponse()
        reset()
      } else if (playerTwoTiebreakPoint >= 7 && playerTwoTiebreakPoint - playerOneTiebreakPoint >= 2) {
        playerTwoSetCount++
        prepareResponse()
        reset()
      }
    } else {
      if (playerOneGameCount >= 6 && playerOneGameCount - playerTwoGameCount >= 2) {
        playerOneSetCount++
        prepareResponse()
        reset()
      } else if (playerTwoGameCount >= 6 && playerTwoGameCount - playerOneGameCount >= 2) {
        playerTwoSetCount++
        prepareResponse()
        reset()
      }
    }
  }

  function prepareResponse () {
    resultArray.push(
      {   
        playerOnePoint: playerOnePoint,
        playerTwoPoint: playerTwoPoint,
        playerOneTiebreakPoint: playerOneTiebreakPoint, 
        playerTwoTiebreakPoint: playerTwoTiebreakPoint,
        playerOneGameCount: playerOneGameCount,
        playerTwoGameCount: playerTwoGameCount,
        tiebreak: tiebreak,
      },
    )
  }

  //LOOP THROUGH POINTS
  for (let i = 0; i < pointsArray.length; i++) {
    if (pointsArray[i] === '1') {
      if (tiebreak) {
        playerOneTiebreakPoint++
      } else {
        playerOnePoint++
      }
    } else if (pointsArray[i] === '2') {
      if (tiebreak) {
        playerTwoTiebreakPoint++
      } else {
        playerTwoPoint++
      }
    }

    if (playerOneGameCount >= 6 && playerTwoGameCount >= 6) {
      tiebreak = true 
      checkSetWinner()
    }

    if (pointsChecker()) {
      checkSetWinner()
    }
    
    if (playerOneSetCount > 2 || playerTwoSetCount > 2) {
      let matchWinner = playerOneSetCount > playerTwoSetCount ? "1" : "2"
      resultArray.push({matchWinner: matchWinner})
      return resultArray
    } 
    
    //NO MATCH WINNER BUT CHECKED ALL THE POINTS
    if (i === pointsArray.length - 1) {
      prepareResponse()
      return resultArray
    }
  }
}

module.exports = { analysePoints }