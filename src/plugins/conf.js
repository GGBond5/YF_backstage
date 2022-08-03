let env = process.env.NODE_ENV;
let IP = env == 'development'?window.publicIP.ip[0]:window.publicIP.ip[1];
let port = env == 'development'?window.publicIP.port[0]:window.publicIP.port[1];
let path = env == 'development'?window.publicIP.path[0]:window.publicIP.path[1];
let websocket = "ws://"+IP+port+path+'/'
//api调用的地址
function baseUrl() {
    return 'http://' + IP + port + path + '/';
}

export default {
    baseUrl,
    IP,
    websocket
}
