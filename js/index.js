window.onload=function(){
	var leavl = document.getElementById("leavl");
	var go = document.getElementById("go");
	var route = parseInt(window.location.href.split('#')[1]);
	if(route){
		if(route == 7){
		route = 0;
	}
	leavl.innerHTML = route + 1; //控制关卡
	go.setAttribute("href","start.html#" + route); //控制地址链接
	}
}