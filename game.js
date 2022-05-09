import sendToWs from "./sendToWs.js"

const playerNumInfo = [{
        colour: "#bf2c17", //red
        position: {
            x: 0.4,
            y: 0.5
        }
    },
    {
        colour: "#2823ea", //blue
        position: {
            x: 1.6,
            y: 0.5
        }
    },
    {
        colour: "#0fde0b", //green
        position: {
            x: 0.8,
            y: 0.5
        }
    },
    {
        colour: "#8401d9", //green
        position: {
            x: 1.2,
            y: 0.5
        }
    },
]

const amoAmount = 3

class Game {
    constructor(players) {
        this.playersWs = players
        this.players = []
        this.asteroids = []
        this.startTime = new Date()
        this.interval = setInterval(() => this.tick(), 50)
        for (let i = 0; i < this.playersWs.length; i++) {
            const pNumInfo = playerNumInfo[i]
            this.players.push({
                colour: pNumInfo.colour,
                position: {
                    x: pNumInfo.position.x,
                    y: pNumInfo.position.y
                },
                bullets: [],
                facing: 0,
                turnMomentum: 0,
                ammunition: amoAmount,
                movementVector: {
                    x: 0,
                    y: 0
                }
            })
        }
        for (let i = 0; i < this.playersWs.length; i++) {
            const playerWs = this.playersWs[i]
            sendToWs(playerWs.ws, 'gameFound', {
                players: this.players,
                playerNum: i,
                asteroids: []
            })
        }
    }

    info(data, id) {
        let playerNum = null
        for (let i = 0; i < this.playersWs.length; i++)
            if (this.playersWs[i].id === id)
                playerNum = i
        if (playerNum === null) throw new Error("Player " + id + " is not in this game.")
        this.players[playerNum] = data.players
        if (playerNum === 0)
            this.asteroids = data.asteroids
    }

    tick() {
        for (let i = 0; i < this.playersWs.length; i++) {
            sendToWs(this.playersWs[i].ws, 'gameInfo', {
                players: this.players,
                asteroids: this.asteroids
            })
        }
    }
}

export default Game