const playerForm = document.getElementById("player-form")
const playBtn = document.getElementById("play-btn")
const pointsList = document.getElementById("points-list")
const analysisBtn = document.getElementById("analysis-btn")
const scoreboard = document.getElementById("scoreboard")
const gameMessages = document.getElementById("game-messages")
let playerOneName
let playerTwoName
let playerOneLevel
let playerTwoLevel
const pointsArray = []
let count = 1

playerForm.addEventListener("submit", (event) => {
    event.preventDefault()
    playerOneName = document.getElementById("one-name").value
    let playerOneLevelString = document.getElementById("one-level").value
    playerOneLevel = Number(playerOneLevelString)

    playerTwoName = document.getElementById("two-name").value
    let playerTwoLevelString = document.getElementById("two-level").value
    playerTwoLevel = Number(playerTwoLevelString)

    if (
        playerOneName.length > 0 
        && playerOneName.length < 16 
        && playerOneLevel > 0 
        && playerOneLevel < 11 
        && playerTwoName.length > 0 
        && playerTwoName.length < 16
        && playerTwoLevel > 0 
        && playerTwoLevel < 11
        && playerOneName !== playerTwoName
    ) {
        const inputs = document.querySelectorAll("input")
        inputs.forEach(input => input.disabled = "true")
        const gameMsg = document.createElement("p")
        gameMsg.innerText = "Click the 'Let's play tennis!' button to start your game."
        gameMessages.appendChild(gameMsg)
        const playerDetails = document.getElementById("player-details")
        playerDetails.innerText = "Player details:"
        playBtn.disabled = false
    } else {
        const formError = document.createElement("p")
        formError.innerText = "Please ensure players names are no more than 15 characters long (and different from each other) and that player levels are between 1 and 10 inclusive"
        playerForm.appendChild(formError)
    }
})

playBtn.addEventListener("click", () => {
    let playerOneWinner
    
    let abilityDifference
    //Each additional point in player level equates to 5% more probability of winning a point (simultaneously 2.5% less for the weaker player and 2.55% more for the stronger player)
    if (playerOneLevel >= playerTwoLevel) {
        abilityDifference = (playerOneLevel - playerTwoLevel) * 2.5 
        playerOneWinner = 50 + abilityDifference
    } else {
        abilityDifference = (playerTwoLevel - playerOneLevel) * 2.5
        playerOneWinner = 50 - abilityDifference
    }

    for (let i = 0; i < 150; i++) {
       
        if (Math.floor(Math.random() * 100) + 1 <= playerOneWinner) {
            //PLAYER ONE WINS THE POINT
            pointsArray.push("1")
            const point = document.createElement("p")
            point.innerText = `Point ${count} won by ${playerOneName}`
            pointsList.appendChild(point)
        } else {
            //PLAYER TWO WINS THE POINT
            pointsArray.push("2")
            const point = document.createElement("p")
            point.innerText = `Point ${count} won by ${playerTwoName}`
            pointsList.appendChild(point)
        }
        count++
    }
    analysisBtn.disabled = false
    const gameMsg = document.createElement("p")
    gameMsg.innerText = "If you 'Click to get the score' and the match is undecided click `Let's play tennis!` again and the players will play more points.  \nThen 'Click to get the score' to see if there is a winner. \nTo re-start the game with new players refresh the page."
    gameMessages.innerHTML = ""
    gameMessages.appendChild(gameMsg)
})


analysisBtn.addEventListener("click", async () => {
    
    try {
        const responseJson = await fetch("https://letsplaytennis.onrender.com/letsplaytennis",
            {   
                method: "POST",
                body: JSON.stringify({
                    data: pointsArray,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }
        )
        const response = await responseJson.json()
        
        //RESET SCOREBOARD
        scoreboard.innerHTML = ""

        //TABLE CAPTION
        let tableCaption = document.createElement("caption")
        let currentGame = false

        if (response.data[response.data.length - 1].matchWinner) {
        let winner = response.data[response.data.length - 1].matchWinner === "1" ? playerOneName : playerTwoName
        tableCaption.innerText = `Result: ${winner} has won the match!` 
        } else {
            tableCaption.innerText = "Result: The match is still going, no winner yet"
            currentGame = true
        }

        scoreboard.appendChild(tableCaption)

        //TABLEHEAD and empyty column header
        const tableHead = document.createElement("thead")
        scoreboard.appendChild(tableHead)

        const tableHeadRow = document.createElement("tr")
        tableHead.appendChild(tableHeadRow)
        const columnHeader = document.createElement("th")
        columnHeader.scope = "col"
        tableHeadRow.appendChild(columnHeader)

        //TABLEBODY and playernames
        const tableBody = document.createElement("tbody")
        scoreboard.appendChild(tableBody)
        
        const playerOneRow = document.createElement("tr")
        tableBody.appendChild(playerOneRow)
        const playerOneRowName = document.createElement("th")
        playerOneRowName.scope = "row"
        playerOneRowName.innerText = playerOneName
        playerOneRow.appendChild(playerOneRowName)

        const playerTwoRow = document.createElement("tr")
        tableBody.appendChild(playerTwoRow)
        const playerTwoRowName = document.createElement("th")
        playerTwoRowName.scope = "row"
        playerTwoRowName.innerText = playerTwoName
        playerTwoRow.appendChild(playerTwoRowName)

        let iterations = currentGame ? response.data.length : response.data.length - 1
        let setCount = 1
        for (let i = 0; i < iterations; i++) {
            
            const setColHeader = document.createElement("th") 
            setColHeader.scope = "col"
            setColHeader.innerText = `Set ${setCount}`
            setCount++
            tableHeadRow.appendChild(setColHeader)

            let playerOneGames = document.createElement("td")
            let playerTwoGames = document.createElement("td")

            if (response.data[i].tiebreak) {
                if (response.data[i].playerOneTiebreakPoint > response.data[i].playerTwoTiebreakPoint && response.data[i].playerOneTiebreakPoint > 6) {
                    playerOneGames.innerText = 7
                    playerTwoGames.innerText = 6
                } else if (response.data[i].playerTwoTiebreakPoint > response.data[i].playerOneTiebreakPoint && response.data[i].playerTwoTiebreakPoint > 6) {
                    playerOneGames.innerText = 6
                    playerTwoGames.innerText = 7
                } else {
                    playerOneGames.innerText = 6
                    playerTwoGames.innerText = 6
                }
            } else {
                playerOneGames.innerText = response.data[i].playerOneGameCount
                playerTwoGames.innerText = response.data[i].playerTwoGameCount
            }
            playerOneRow.appendChild(playerOneGames)
            playerTwoRow.appendChild(playerTwoGames)
            
        }

        if (currentGame) {
            const currentGameColHeader = document.createElement("th") 
            currentGameColHeader.scope = "col"
            currentGameColHeader.innerText = `Current Game`
            tableHeadRow.appendChild(currentGameColHeader)

            let playerOneCGPoints = document.createElement("td")
            let playerTwoCGPoints = document.createElement("td")
            
            let lastElement = response.data.length - 1
            if (response.data[lastElement].playerOnePoint > 3 && response.data[lastElement].playerTwoPoint > 3) {
                if (response.data[lastElement].playerOnePoint > response.data[lastElement].playerTwoPoint) {
                    playerOneCGPoints.innerText = "AV"
                    playerTwoCGPoints.innerText = "-"
                } else if (response.data[lastElement].playerOnePoint < response.data[lastElement].playerTwoPoint) {
                    playerOneCGPoints.innerText = "-"
                    playerTwoCGPoints.innerText = "AV"
                } else {
                    playerOneCGPoints.innerText = "40"
                    playerTwoCGPoints.innerText = "40"
                }
            } else if (response.data[lastElement].tiebreak) {
                playerOneCGPoints.innerText = response.data[lastElement].playerOneTiebreakPoint
                playerTwoCGPoints.innerText = response.data[lastElement].playerTwoTiebreakPoint
            } else {
                playerOneCGPoints.innerText = response.data[lastElement].playerOnePoint * 15 === 45 ? 40 : response.data[lastElement].playerOnePoint * 15
                playerTwoCGPoints.innerText = response.data[lastElement].playerTwoPoint * 15 === 45 ? 40 : response.data[lastElement].playerTwoPoint * 15
            }

            playerOneRow.appendChild(playerOneCGPoints)
            playerTwoRow.appendChild(playerTwoCGPoints)
        }
        
    } catch (error) {
        console.log(error)
    }
})