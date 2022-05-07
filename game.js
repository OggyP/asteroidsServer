const playerNumInfo = [{
        colour: "#bf2c17", //red
        position: {
            x: 0.2,
            y: 0.5
        }
    },
    {
        colour: "#2823ea", //blue
        position: {
            x: 0.8,
            y: 0.5
        }
    },
    {
        colour: "#0fde0b", //green
        position: {
            x: 0.4,
            y: 0.5
        }
    },
    {
        colour: "#8401d9", //green
        position: {
            x: 0.6,
            y: 0.5
        }
    },
]

class Game {
    constructor(players) {
        this.playersWs = players
        this.players = []
        for (let i = 0; i < players.length; i++) {

        }
    }

    tick() {

    }

    playerLeave() {

    }
}

export default Game