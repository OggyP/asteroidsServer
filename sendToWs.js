function sendToWs(ws, eventType, data) {
    let wsMsg = {}
    wsMsg.type = eventType
    if (data.constructor === Array) {
        wsMsg.data = {}
        data.forEach(item => {
            wsMsg.data[item[0]] = item[1]
        })
    } else {
        wsMsg.data = data
    }
    // console.log(JSON.stringify(wsMsg))
    ws.send(JSON.stringify(wsMsg))
}

export default sendToWs