import mongoose from 'mongoose'

const Schema = mongoose.Schema

const temperatureSchame = new Schema({
	temperature: {
		type: Number,
		required: true
	},
	meta: {
		createdAt:{
			type: Date,
			default: Date.now()
		}
	}
})

temperatureSchame.pre('save', function (next) {
	this.meta.createdAt = Date.now()
	next()
})

mongoose.model('Temperature', temperatureSchame)