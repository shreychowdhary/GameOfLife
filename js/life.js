var FPS = 3;
var canvas = document.getElementById("myCanvas");
var grid = [];
var futureGrid;
pixelwidth = 4;
pixelheight = 4;

if(window.outerWidth < 1000 || window.outerHeight < 400){
	pixelwidth = Math.floor(window.outerWidth/250);
	pixelheight = Math.floor(window.outerHeight/100);
}
canvas.width = Math.ceil(window.outerWidth/(pixelwidth*2))*pixelwidth*2;
canvas.height = Math.ceil(window.outerHeight/(pixelheight*2))*pixelheight*2;

gridwidth = canvas.width/pixelwidth;
gridheight = canvas.height/pixelheight;

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
	$.ajax({url:"https://api.github.com/repos/shreychowdhary/GameOfLife/contents/txt/start.txt",
		success:function(data){
			text = decode(data.content);
			console.log(text);
			for(i = gridheight/2-25; i < gridheight/2+25; i++){
				for(j = gridwidth/2-100; j < gridwidth/2+100; j++){
					grid[j][i] = text.charAt((i-(gridheight/2-25))*201+(j-(gridwidth/2-100)));
				}
			}
		},
		dataType:"json",
		async:false});
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
	period++;
}, 1000/FPS);


function decode (input) {
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = _utf8_decode(output);

    return output;
}

function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}