const ws = require('nodejs-websocket')


class SocketServer {

    constructor(port, message, callback) {
    	this.connection = []
    	this.message = message ? message : 'null'
	    if(callback) {
    		this.callback = callback
	    }
        this.server = ws.createServer(conn => {
        	console.log(`socket通讯建立在${port}上`.blue);
        	
			this.boardcast(JSON.stringify(this.message))
	        
            conn.on('close', () => {
                console.log(port+'有一个连接离开！');
            })
            
            conn.on('error', err => {
                console.log(err)
            })
            
	        conn.on('text' ,str => {
            	this.message = JSON.parse(str)
	            this.callback(this.message)
            })
	        
        }).listen(port)
    }

    boardcast (str) {
        this.server.connections.forEach(conn => {
            conn.sendText(str)
        });
    }

    // receiveMsg (callback) {
    //     this.server.connections.forEach(conn => {
    //
    //     })
    // }

}

module.exports = SocketServer

