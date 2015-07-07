var field;

function isValidField(text) {
	try {
		eval(text);
		var someValue = field(10, 10);
		return true;
	}
	catch (err) {
		return false;
	}
}

function drawArrows(ctx) {
	ctx.fillStyle = "#FFFFFF";
	var sizeWidth = ctx.canvas.clientWidth;
	var sizeHeight = ctx.canvas.clientHeight;

	ctx.fillRect(0, 0, sizeWidth, sizeHeight);

	ctx.fillStyle = "#0000DD";
	ctx.strokeStyle = "#0000DD";


	var spacing = 20;
	var minX = -(sizeWidth / 2.0);
	var maxX = sizeWidth / 2.0;
	var minY = -sizeHeight / 2.0;
	var maxY = sizeHeight / 2.0;

	for (var x = minX; x <= maxX; x+=spacing) {
		for (var y = minY; y <= maxY; y+=spacing) {
			ctx.fillRect(x - minX, y - minY, 2, 2);

			var editor = ace.edit("editor");
			var text = editor.getValue();
			eval(text);

			var vect = field(x, y);

			drawArrow(
				ctx,
				x - minX, y - minY,
				vect[0], vect[1]);
		}
	}
}

function drawArrow(ctx, fromx, fromy, relx, rely) {
	drawArrowAbsolute(ctx, fromx, fromy, fromx+relx, fromy+rely);
}
function drawArrowAbsolute(ctx, fromx, fromy, tox, toy){
    var headlen = 10;

    var angle = Math.atan2(toy-fromy,tox-fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 1;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#cc0000";
    ctx.fill();
}

function fieldFunc(x, y) {
	return [x, y];
}


function draw(ctx) {
	"use strict";
	drawArrows(ctx);
}


function setupScene() {
	"use strict";
	field = fieldFunc;
}
