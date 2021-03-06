// Minimal amount of secure websocket server

import Queue from './queue.js';
import http from 'http'

import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import sendToWs from "./sendToWs.js"

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

const queues = []
const games = {} // TODO: Every 30s clear finished games from list
const validGameModes = ['2', '3', '4']
for (let i = 0; i < validGameModes.length; i++)
    queues.push(new Queue(Number(validGameModes[i]), games))


wss.on('connection', function connection(ws, request, gameMode) {
    console.log("req, client", request, gameMode)

    const id = uuidv4()

    console.log(queues)

    const gameId = queues[gameMode - 2].join(id, ws)

    ws.on('message', function message(data) {
        // console.log(`Received message ${data} from user ${id}`);

        try {
            const msg = JSON.parse(data)

            const game = games[gameId]
            if (!game) throw new Error("Mr Not Cheating")

            switch (msg.type) {

                case ('gameInfo'):
                    game.info(msg.data, id)
                    break;
                case ('fire'):
                    game.fire(msg.data, id)
                    break;
            }

        } catch (e) {
            console.log(e)
            sendToWs(ws, 'error', { error: e.stack })
        }
    });

    ws.on('close', function(client) {
        for (let i = 0; i < queues.length; i++)
            queues[i].leave(id)
    });

    ws.on('error', function(client) {
        for (let i = 0; i < queues.length; i++)
            queues[i].leave(id)
    });
});

server.on('upgrade', function upgrade(request, socket, head) {

    const urlPath = request.url.split('/').slice(1)
    console.log(urlPath)

    if (!(urlPath.length === 2 && urlPath[0] === 'gameMode' && validGameModes.includes(urlPath[1]))) {
        socket.write('HTTP/1.1 400 L that url is not very good\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request, Number(urlPath[1]));
    });
});

console.log("Server Started")
server.listen(8448);