import $http from './axios'

export const getAllTem = async (time, page = 0, limit = 10) => {
	try {
		let res = await $http({
			method : 'get',
			url:'',
			params: {
				time,
				page,
				limit
			}
		})
		return res
	} catch (e) {
		throw new Error(e)
	}
}

export const login = async (username, password) => {
	try {
		let res = await $http({
			method: 'post',
			url: 'user/',
			data: {
				username,
				password
			}
		})
		return res
	} catch (e) {
		throw new Error(e)
	}
}