import router from "./../router";
import conf from '@/plugins/conf.js';
//import context from '../main.js'
import util from '@/plugins/util.js';
import axios from 'axios';
import { Message } from "element-ui";
import refreshToken from './refreshToken';
axios.defaults.withCredentials = true;

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

const Axios = axios.create({
    baseURL: conf.baseUrl(),
    timeout: 20000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json;application/octet-stream"
    }
});
const Axios2 = axios.create({
    baseURL: conf.baseUrl(),
    timeout: 20000,
    responseType: "json",
});
Axios.setToken = (token) => {
    Axios.defaults.headers.JSESSIONID = token;
    util.setCookie('accessToken', token); //jwt
}

Axios.interceptors.request.use(
    config => {
        // console.log('---------',config)
		if (util.getCookie('accessToken')) {
            config.headers['X-Admin-Token'] = util.getCookie('accessToken');
        }else{
            //console.log('发起请求-没有token')
        }
		if(config.data){
			let data = typeof config.data === "string"?JSON.parse(config.data):JSON.parse(JSON.stringify(config.data));
			if(data.responseType){
				config.responseType = data.responseType;
				delete data.responseType;
            }
            if(data.method){
				config.method = data.method;
				delete data.method;
            }
            if(data.timeout){
				config.timeout = data.timeout;
				delete data.timeout;
            }
            if(data.headers){
				config.headers['Content-Type'] = data.headers; 
				delete data.headers;
            }
            config.data = typeof config.data === "string"?JSON.stringify(data):data;
		}
		//console.log(config);
        return config;
    },
    error => {
        Message({
            message: '请求错误',
            type: 'error'
        });
        return Promise.reject(error);
    }
)

Axios.interceptors.response.use(
    response => {
		// console.log('00000',response);
		let data = response.data;
		if(response.request.responseType === "blob"){
			data = {
				code:response.status===200?0:response.status,
				msg:response.statusText,
				data:response.data
			};
            return data
		}else if(data.code === 0){
            return data
        }else{
            if(data.msg === '请求异常：请重新登录'){
                Message({
                    message: '请求异常：请重新登录',
                    type: 'error',
                    duration: 1500,
                    onClose: ()=>{
                        router.push('/Login')
                    }
                })
            }else{
                Message({
                    message: 'data.msg',
                    type: 'error',
                    duration: 2000
                })
            }
            return {}
        }
    },
    async error => {
        // console.log('11111',error.response)
        if(error.response && error.response.status==402){
            let data = {
                code: -2,
                status: 401
            }
            return data
        }else if(error.response && error.response.status==401){
            if(!isRefreshing){
                isRefreshing = true;
                try {
                    const { data: { accessToken } } = await refreshToken();
                    if(accessToken){
                        Axios.setToken(accessToken);
                        error.response.config.headers.Authorization = accessToken;
                        // 已经刷新了token，将所有队列中的请求进行重试
                        requests.forEach(cb => cb(accessToken));
                        requests = [];
                        return Axios(error.response.config);
                    }
                } catch (error) {   //刷新时候直接判断token 不用判断code
                    console.error('refreshtoken error =>', error);
                    // routerRedirect({ redirect: router.currentRoute.fullPath });
                    Message({
                        message: '请先登录!',
                        type: 'error'
                    })
                } finally {
                    isRefreshing = false;
                }
            }else{
                // 正在刷新token，将返回一个未执行resolve的promise
                return new Promise((resolve) => {
                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                    requests.push((token) => {
                        error.response.config.headers.Authorization = token;
                        resolve(Axios(error.response.config));
                    });
                });
            }
        }else{
            Message({
                message: '请求失败',
                type: 'error'
            })
            return false;
        }
    }
);
function fetch(path, params) {
    return new Promise((resolve, reject) => {
        Axios.post(path, params)
            .then(response => {
				resolve(response);
            }, err => {
				//console.log(err);
                reject(err);
            })
            .catch(error => {
                reject(error)
            })
    });
}
function upload(path, body) {
    return new Promise((resolve, reject) => {
        Axios.post(path, body, {
            headers: {
                'Content-Type': "multipart/form-data",
            },
            transformRequest: [function(){
                return body;
            }],
        }).then(response => {
            resolve(response);
        }, err => {
            reject(err);
        })
        .catch(error => {
            reject(error)
        })
    });
}
function download(path, params) {
    return new Promise((resolve, reject) => {
        Axios.get(path,{
            headers:{
                'Content-Type':'application/json; application/octet-stream',
            },
            responseType:'blob',
            params:params
        }).then(response => {
            resolve(response);
        }, err => {
            reject(err);
        })
        .catch(error => {
            reject(error)
        })
    });
}
function fetchGet(path, params) {
    return new Promise((resolve, reject) => {
        Axios.get(path,{ params:params})
            .then(response => {
				resolve(response);
            }, err => {
				//console.log(err);
                reject(err);
            })
            .catch(error => {
                reject(error)
            })
    });
}

function websocket(){
    return conf.websocket
}

export default {
    fetch,
    upload,
    download,
    fetchGet,
    websocket
}
