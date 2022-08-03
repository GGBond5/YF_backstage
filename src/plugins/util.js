function setCookie(name,value){ 
  var Days = 30; 
  var exp = new Date(); 
  exp.setTime(exp.getTime() + Days*24*60*60*1000); 
  document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString(); 
}

//获取cookie
function getCookie(name){ 
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  arr=document.cookie.match(reg);
  return arr?unescape(arr[2]):null;
}

//删除cookie
function delCookie(name){ 
  var exp = new Date(); 
  exp.setTime(exp.getTime() - 1); 
  var cval=getCookie(name); 
  if(cval!=null){
    document.cookie= name + "="+cval+";path=/;expires="+exp.toGMTString();
  }
}

module.exports = { setCookie, getCookie, delCookie }