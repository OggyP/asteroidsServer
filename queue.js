import Game from './game.js'
import sendToWs from './sendToWs.js'
import { v4 as uuidv4 } from 'uuid';

class Queue {
    constructor(playerLimit, games) {
        this.playerLimit = playerLimit
        this.players = []
        this.gamesList = games
        this.gameId = uuidv4()
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
            const currentGameId = this.gameId
            this.gamesList[currentGameId] = new Game(this.players.slice())
            this.players = []
            this.gameId = uuidv4()
            return currentGameId
        } else
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i]
                sendToWs(player.ws, 'queue', { display: 'Queueing: ' + this.players.length + '/' + this.playerLimit + ' found' })
            }
        return this.gameId
    }
}

export default Queue