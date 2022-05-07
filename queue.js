import Game from './game.js'
import sendToWs from './sendToWs.js'

class Queue {
    constructor(playerLimit, gamesList) {
        this.playerLimit = playerLimit
        this.players = []
        this.gamesList = gamesList
    }
    leave(id) {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.id === id) {
                this.players.splice(i, 1)
                for (let i = 0; i < this.players.length; i++) {
                    const player = this.players[i]
                    sendToWs(player.ws, 'queue', { display: 'Queueing: ' + this.players.length + '/' + this.playerLimit + ' found' })
                }
                break
            }
        }
    }
    join(id, ws) {
        this.players.push({
            id: id,
            ws: ws
        })
        if (this.players.length === this.playerLimit) {
            this.gamesList.push(new Game(this.players.slice()))
            this.players = []
        } else
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i]
                sendToWs(player.ws, 'queue', { display: 'Queueing: ' + this.players.length + '/' + this.playerLimit + ' found' })
            }
    }
}

export default Queue