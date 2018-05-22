import axios from 'axios'

let instance = axios.create({
	baseURL: `${location.protocol}/api/v0/`,
	timeout: 5000
})

instance.interceptors.request.use(
  config => {
    let token = localStorage.getItem('token');
    if(token){
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    if(error.response){
      switch (error.response.status){
	      case 401:
          alert('登陆超时')
          // app.$router.replace('/login')
      }
    }
    return Promise.reject(error);
  }
);

export default instance