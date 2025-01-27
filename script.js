class AweleBoard {
    gameObj = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        L: 0
    }

    displayBoard = () => {
        console.log(this.gameObj)
        return this.gameObj
    }

    isEmpty = () => {
        return Object.values(this.gameObj).filter((hole) => hole !== 0).length === 0 ? false : true
    }

    init = () => {
        for (const hole in this.gameObj) {
            this.gameObj[hole] += 4
        }
    }

    isInAdvHole = (hole, player) => {
        return player.playerHoles.includes(hole) ? false : true
    }

    saw = (hole, player) => {
        const originSeedsCount = this.gameObj[hole]
        let croup = originSeedsCount > 11 ? true : false
        
        const reversedKeys = Object.keys(this.gameObj).reverse()
        const duplicatedReversedKeys = [...reversedKeys, ...reversedKeys]
        const originIndex = duplicatedReversedKeys.indexOf(hole)
        this.gameObj[hole] = 0
        
        for (let i = 0; i < originSeedsCount; i++) {
            
            const currentHole = duplicatedReversedKeys[originIndex + i + 1]

            if (croup && currentHole === hole) continue

            this.gameObj[currentHole] += 1

            if (i < originSeedsCount - 1) continue

            // last seed
            // return if last seed is not in adv hole
            if (!this.isInAdvHole(currentHole, player)) return

            // return if last holes !== 2 or 3
            if (![2,3].includes(this.gameObj[currentHole])) return

            // harvest hole
            this.harvest(currentHole, player)

        }
    }

    // check if current hole count === 2 or 3
    // if so => clean hole, add seeds to seed count
    // go to next hole
    harvest = (hole, player) => {
        let seedCount = 0
        const keys = Object.keys(this.gameObj)
        const duplicatedKeys = [...keys, ...keys]
        const originIndex = duplicatedKeys.indexOf(hole)
        let runLoop = true
        let loopCount = 0

        while (runLoop) {
            const currentHole = duplicatedKeys[originIndex + loopCount]
            if (![2,3].includes(this.gameObj[currentHole])) break
            seedCount += this.gameObj[currentHole]
            this.gameObj[currentHole] = 0
            loopCount++
        }
        player.incrementScore(seedCount)
    }
}

class Player {
    constructor(name, playerNumber) {
        this.name = name
        this.playerNumber = playerNumber
        this.playerHoles = playerNumber === 1 ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['G', 'H', 'I', 'J', 'K', 'L']
    }

    score = 0

    incrementScore = (seeds) => {
        this.score += seeds
        return this.score
    }
}

const aweleGame = new AweleBoard
aweleGame.init()

const playerOneName = prompt('enter player one name')
const playerTwoName = prompt('enter player two name')

const playerOne = new Player(playerOneName, 1)
const playerTwo = new Player(playerTwoName, 2)

// main game loop
let playerTurn = playerOne
while (aweleGame.isEmpty()) {
    aweleGame.displayBoard()
    console.log(`${playerOne.name} score:`, playerOne.score)
    console.log(`${playerTwo.name} score:`, playerTwo.score)
    const result = prompt(`it's ${playerTurn.name} turn to play! select a hole between A and L`)
    aweleGame.saw(result, playerTurn)
    playerTurn = playerTurn == playerOne ? playerTwo : playerOne

}

