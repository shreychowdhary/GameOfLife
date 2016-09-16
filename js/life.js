var FPS = 2;
var canvas = document.getElementById("myCanvas");
var grid = [];
var futureGrid;
canvas.width = Math.ceil(document.documentElement.clientWidth/4)*4;
canvas.height = Math.ceil(document.documentElement.clientHeight/4)*4;
console.log(document.documentElement.clientHeight);
gridwidth = canvas.width/4;
gridheight = canvas.height/4;
console.log(gridwidth);
pixelwidth = canvas.width/gridwidth;
pixelheight = canvas.height/gridheight;

function load(){

}

function initateGrid(){
	
	grid.length = gridwidth;
	for(i = 0; i < gridwidth; i++){
		grid[i] = [];
		grid[i].length = gridheight;
		for(j = 0; j < gridheight; j++){
			grid[i][j] = (Math.random() > .8)? 1 : 0;
			if(grid[i][j] == 1){
				console.log("true");
			}
		}
	}
	$.get("txt/start.txt",function(data){
		for(i = 0; i < 10; i++){
			for(j = 0; j < 30; j++){
				if(i==0 && j == 29){
					console.log(data);
				}
			}
		}
	},"text");
}

function mod(num,mod){
	return((num%mod)+mod)%mod;
}

function neighbors(x,y){
	//check if the top row,bottom row, left row, and right row are populate
	near = 0;
	for(i = -1; i <= 1; i++){
		for(j = -1; j <= 1; j++){
			if((i!=0 || j!=0) && grid[mod(x+i,gridwidth)][mod(y+j,gridheight)] == 1){
				near++;
			}
		}
	}
	return near;
}

function update(){
	futureGrid = grid.slice();
	for(i = 0; i < gridwidth; i++){
		futureGrid[i] = grid[i].slice();
	}
	for(x = 0; x < gridwidth; x++){
		for(y = 0; y < gridheight; y++){
			near = neighbors(x,y);
			if(grid[x][y] == 1){
				if(near == 2 || near == 3){
					futureGrid[x][y] = 1;
				}
				else{
					futureGrid[x][y] = 0;
				}
			}
			if(grid[x][y] == 0 && near == 3){
				futureGrid[x][y] = 1;
			}
			//console.log(futureGrid[x][y] + " " + grid[x][y]);
		}
	}
	grid = futureGrid;
}


function draw(){
	if(canvas.getContext){
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgb(200,0,0)";
		for(i = 0; i < canvas.width; i+=pixelwidth){
			for(j = 0; j < canvas.height; j+= pixelheight){
				if(grid[i/pixelwidth][j/pixelheight] == 1){
					ctx.fillRect(i,j,pixelwidth,pixelheight);
				}
			}
		}
	}
}

initateGrid();
draw();
period = -2;

setInterval(function() {
	if(period > 0){
		update();
		draw();
	}
	console.log(period);
	period++;
	if(period >= 100){
		period = -2;
		initateGrid();
		draw();		
	}
}, 1000/FPS);
