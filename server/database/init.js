import mongoose from 'mongoose'
import glob from 'glob'
import { resolve } from 'path'

const db = 'mongodb://localhost/my_ioT'

mongoose.Promise = global.Promise

export const initSchemas = () => {
	glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(item => {
		console.log(item);
		require(item)
	})
}

// export const initAdmin = async () => {
// 	const User = mongoose.model('User')
// }

export const connect = () => {
	let maxConnect = 0
	
	return new Promise((resolve, reject) => {
		if(process.env.NODE_ENV !== 'production'){
			mongoose.set('debug', true)
		}
		
		mongoose.connect(db)
		
		mongoose.connection.on('disconnected', () => {
			maxConnect++
			if(maxConnect < 5) {
				mongoose.connect(db)
			} else {
				reject()
				throw new Error('数据库连接失败！')
			}
		})
		
		mongoose.connection.on('error', err => {
			maxConnect++
			if(maxConnect < 5){
				mongoose.connect(db)
			} else {
				reject(err)
				throw new Error('数据库连接异常！')
			}
		})
		
		mongoose.connection.on('open', () => {
			resolve()
			console.log('MongoDB成功连接'.bgGreen)
		})
	})
}