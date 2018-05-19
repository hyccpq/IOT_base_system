import mongoose from 'mongoose'

const getTemDatabase = mongoose.model('Temperature')

export const getAllTem = async (time, limit = 10, skip = 0) => {

}