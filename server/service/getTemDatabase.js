import mongoose from 'mongoose'

const getTemDatabase = mongoose.model('Temperature')

export const getAllTem = async (time, limit = 10, skip = 0) => {
	let query = {}
	if(time) {
		query.meta.createdAt = time
	}
	
	try {
		const tem = await getTemDatabase.find(query).limit(limit).skip(skip)
		
		return tem
	} catch (e) {
		console.log(e)
	}
}