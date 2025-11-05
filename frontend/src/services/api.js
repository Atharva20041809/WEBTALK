import axios from 'axios';

const API =  axios.create({
    baseURL: 'https://webtalk-backend-r1xs.onrender.com'
    // baseURL: 'http://localhost:5000'
})
export function signupUser(data){
    return API.post('/signup',data)
}
export function loginUser(data){
    return API.post('/login',data)
}
export default API;

