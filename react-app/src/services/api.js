import axios from 'axios';
 export const BASE_URL='http://localhost:5000';
 const api= axios.create({
    baseURL: `${BASE_URL}/api`
 })
 export const authApi=axios.create({
  baseURL:`${BASE_URL}/auth`
 })
  authApi.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    config.headers.Authorization=`Bearer ${token}`;
    return config;
  })
 api.interceptors.request.use((config)=>{
   const token=localStorage.getItem("token");
   config.headers.Authorization=`Bearer ${token}`;
   return config;
 });
export default api;