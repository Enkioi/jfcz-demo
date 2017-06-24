window.onload=function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	/*定义圆心坐标与半径*/
	var X = 300;
	var Y = 200;
	var R = 40; //大球半径
	var ballR = 10; //小球半径
	/*定义关卡旋转球，和等待球，和速度的数据*/
	var levelArray = [
		{"routeNum":3,"awaitNum":5,"speed":200},
		{"routeNum":4,"awaitNum":8,"speed":185},
		{"routeNum":5,"awaitNum":5,"speed":165},
		{"routeNum":3,"awaitNum":7,"speed":145},
		{"routeNum":4,"awaitNum":8,"speed":125},
		{"routeNum":5,"awaitNum":5,"speed":105},
		{"routeNum":6,"awaitNum":7,"speed":85},
	];
	/*--------控制关卡----------*/
	var route;
	parseInt(window.location.href.split("#")[1])?route = parseInt(window.location.href.split("#")[1]):route = 0;

	/*--------控制旋转球--------*/
	var balls = [];
	var ballLen = levelArray[route].routeNum;
	var lineLen = 130;
	for(var i=0;i<ballLen;i++){
		var angle = (360/ballLen)*(i+1);
		balls.push({"angle":angle,"numStr":""});
	}
	/*--------控制等待球--------*/
	var awaitBalls = [];
	var awaitOffset = 260;
	var awaitLen = levelArray[route].awaitNum;
	for(var i=awaitLen;i>0;i--){
		awaitBalls.push({"angle":"","numStr":i});
	}
	/*---------绘制大球----------*/
	function bigBall(){
		ctx.beginPath();
		ctx.arc(X,Y,R,0,360*Math.PI / 180,true);
		ctx.fillStyle="black";
		ctx.fill();

		/*---大球中间文字----*/
		if(route == levelArray.length){
			route = levelArray.length - 1;
		}
		var txt = ( route + 1) + "";
		ctx.font = "60px Arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = "#fff";
		ctx.fillText(txt,X,Y);
	}
	/*-------------等待球----------*/
	var awaitX = X;
	var awaitY = lineLen + awaitOffset;
	/*-------------旋转球----------*/
	function rotateBall(deg){
		balls.forEach(function(e){
			ctx.save();
			ctx.globalCompositeOperation = "destination-over";  
			e.angle = e.angle+deg;
			if(e.angle>=360){
				e.angle=0;
			} 
			ctx.moveTo(X,Y);
			var rad = 2 * Math.PI * e.angle / 360;
			var x = X + lineLen * Math.cos(rad);
			var y = Y + lineLen * Math.sin(rad);
			ctx.strokeStyle = "black";
			ctx.lineTo(x,y);
			ctx.stroke();
			ctx.restore();

			ctx.beginPath();
			ctx.arc(x,y,ballR,0,360*Math.PI/180,true);
			ctx.closePath();
			ctx.fillStyle="black";
			ctx.fill();
			if(e.numStr!=""){
				ctx.font = "15px Arial";
				ctx.textbaseline = "middle";
				ctx.textAlign = "center";
				ctx.fillStyle="#fff";
				ctx.fillText(e.numStr,x,y);
			}
		});
	}
	/*---------绘制等待球------------*/
	function await(){
		ctx.clearRect(0,345,900,400);
		awaitBalls.forEach(function(e){
			ctx.moveTo(awaitX,awaitY);
			ctx.beginPath();
			ctx.arc(awaitX,awaitY,ballR,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fillStyle = "black";
			ctx.fill();

			ctx.font = "15px Arial";
			ctx.textbaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle="#fff";
			ctx.fillText(e.numStr,awaitX,awaitY);
			awaitY += 3 * ballR;
		});
	}
   /*-----初始化所有内容-----*/
	function init(deg){
		ctx.clearRect(0,0,900,800);
		rotateBall(deg);
		bigBall();
		await();
	}
	init(0);
	/*------设置旋转速度-------*/
	setInterval(function(){
		ctx.clearRect(0,0,900,345);
		bigBall();
		rotateBall(10);	
	},levelArray[route].speed);

    /*---------点击添加--------*/
    var state;
    document.onclick = function(){
    	if(awaitBalls.length == 0) return;
    	awaitY = lineLen + 200;
    	await();
    	var ball = awaitBalls.shift();
    	ball.angle = 90;
    	var faild = true;

    	/*-----判断是否闯关成功-----*/
    	balls.forEach(function(e,index){
    		if(!faild) return;
    		if(Math.abs(e.angle - ball.angle) / 2 < 360 * ballR / (lineLen * Math.PI)){
    			state = 0;
    			aild = false;
    		}else if(index === balls.length-1 && awaitBalls.length ===0){
    			faild = false;
    			state = 1;
    		}
    	});
    	balls.push(ball); //旋转球添加移除的等待球
    	awaitY = lineLen + awaitOffset;
    	await();
    	rotateBall(0);
    	if(state==0){
    		alert("闯关失败");
    		window.location.href = "index.html#" + route;
    	}else if(state == 1){
    		alert("闯关成功");
    		route++;
    		window.location.href = "index.html#" + route;
    	}
    }
}