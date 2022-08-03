import conf from '@/plugins/conf.js'


function connect(port){
	return new Promise((resolve, reject) => {
		let handler = new WebSocket(conf.websocket+(port?port:""));
		if(handler){
			resolve(handler);
		}else{
			reject({errno:-1001,errmsg:"连接失败！"});
		}
		
	});
}

function send(handler,opt){
	if(!handler || handler.readyState==3){
		return false;
	}else{
		if(handler.readyState==1){
			handler.send(JSON.stringify(opt))
		}else{
			handler.onopen = function() {
				handler.send(JSON.stringify(opt))
			};
		}
		return true;
	}
}


export default{
	connect,
	send
}