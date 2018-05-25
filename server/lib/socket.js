const ws = require('nodejs-websocket')

/**
 * websocket封装
 */
class SocketServer {
	/**
     * 创建socket的构造函数
     * @param {Number} port 端口号
     * @param {Object|Boolean} message 初次连接消息
     * @param {Function|Boolean} callback 接受字符串回调
     * @param {Function|Boolean} cbBinary 接受二进制回调
     */
    constructor(port, message, callback, cbBinary) {
    	this.connection = []
    	this.message = message ? message : 'null'
	    if(callback) {
    		this.callback = callback
	    }
	    if(cbBinary) {
    		this.cbBinary = cbBinary
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
	        
            if(this.callback) {
	            conn.on('text' ,str => {
	            	try {
			            this.message = JSON.parse(str)
			            this.callback(this.message)
		            } catch (e) {
			            this.callback(str)
		            }
		            
		            
	            })
            }
	        
	        if(this.cbBinary) {
				conn.on('binary', inStream => {
					this.cbBinary(inStream)
				})
	        }
	        
	        
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
    // _isJsonString(str) {
    // 	try {
    // 		if (typeof JSON.parse(str) == 'Object') {
    //
		//     }
	 //    }
    // }

}

module.exports = SocketServer

