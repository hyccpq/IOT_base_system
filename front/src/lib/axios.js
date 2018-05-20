import axios from 'axios'

let instance = axios.create({
	baseURL: `${location.protocol}/api/v0/`,
	timeout: 5000
})

export default instance