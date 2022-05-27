import axios from 'axios'
import { message} from 'antd';

const http = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
})

http.interceptors.request.use(
    (config)=>{
        return config
    },
    (error)=>{
        return Promise.reject(error)}
)

http.interceptors.response.use(
    (resonse)=>{
        return resonse
    },
    (error)=>{
        if(error.response.status===500){
            message.info("You do not hold this stock or do not hold enough, please re-enter!");
        }
        return Promise.reject(error)
    }
)

export { http }