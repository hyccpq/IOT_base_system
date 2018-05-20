const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPS = 5
const LOCK_TIME = 30 * 60 * 1000


const userSchema = new Schema({
	username: {
		unique: true,
		type: String
	},
	email: {
		unique: true,
		type: String
	},
	password: {
		unique: true,
		type: String
	},
	lockUntil: Number,
	loginAttepts: {
		type: Number,
		default: 0,
		required: true
	},
	role: {
		type: String,
		default: 'user'
	},
	meta:{
		createdAt:{
			type: Date,
			default: Date.now()
		},
		updatedAt:{
			type: Date,
			default: Date.now()
		}
	}
})

userSchema.virtual('isLocked').get(() => this.lockUntil && this.lockUntil > Date.now())

userSchema.pre('save', function(next) {
	if(this.isNew){
		this.meta.createdAt = this.meta.updatedAt = Date.now()
	} else {
		this.meta.updatedAt = Date.now()
	}
	next()
})

userSchema.pre('save', function(next) {
	if(!this.isModified('password')) return next()
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if(err) return next(err)
		
		bcrypt.hash(this.password, salt, (error, hash) => {
			if(error) return next(error)
			this.password = hash
				console.log(this);
				next()
		})
		
	})
})

userSchema.methods = {
	comparePassword: (_password, password) => {
		return new Promise((resolve, reject) => {
			bcrypt.compare(_password, password, (err, isMatch) => {
				if(!err) resolve(isMatch)
				else reject(err)
			})
		})
	},
	
	incLoginAttepts: user => {
		return new Promise((resolve, reject) => {
			if(this.lockUntil && this.lockUntil < Date.now()){
				this.update({
					$set: {
						loginAttepts: 1
					},
					$unset: {
						lockUntil: 1
					}
				}, err => {
					if(!err) resolve(true)
					else reject(err)
				})
			} else {
				let updates = {
					$inc: {
						loginAttepts: 1
					}
				}
				if(this.loginAttepts + 1 >= MAX_LOGIN_ATTEMPS && this.isLocked){
					updates.$set = {
						lockUntil: Date.now() + LOCK_TIME
					}
				}
				
				this.updates(updates, err => {
					if(!err) resolve(true)
					else reject(err)
				})
			}
		})
	}
}

mongoose.model('User', userSchema)