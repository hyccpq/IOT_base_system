const cv = require('opencv')
let frameObj = {}, func = () => {}

const facialRecognition = (filename, socket, cb) => {
	func = cb
	cv.readImage(filename, function (err, img) {
		if (err) throw err
		if (img.height() < 1 || img.width() < 1) throw new Error('图像尺寸为零！！！')
		
		img.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
			if (err) throw err
			
			
			if (faces && faces.length > 0) {
				let face = faces[0]
				let left = face.x,
					top = face.y,
					width = face.width,
					height = face.height
				frameObj = {
					conf: {
						left,
						top,
						width,
						height
					},
					info: {
						left: left + 'px',
						top: top + 'px',
						width: width + 'px',
						height: height + 'px'
					},
					isShow: true
				}
			} else {
				frameObj = {
					conf: {},
					isShow: false,
					info: {}
				}
			}
				// console.log(JSON.stringify(frameObj.conf));
			socket.boardcast(JSON.stringify(frameObj))
		})
	})
	
}

let timer = setInterval(() => {
	func(frameObj)
}, 500)

module.exports = facialRecognition
