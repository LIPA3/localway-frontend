import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/",
    headers:{
        "Content-Type":"application/json",
    },
    timeout:10000
});
api.interceptors.response.use(
   (response) => {
     // handle response
     return response;
   },
   (error) => {
     // handle response error
	const {status, data} = error.response;
    console.log(status, data);
    
      if (status === 404) {
        alert("请求的资源不存在");
      }
     return Promise.reject(error);
   }
);
export default api;