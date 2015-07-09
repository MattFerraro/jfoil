var wing;
var midPoints;

function graphContext(ctx) {
    /*
    Given an ordinary CanvasRenderingContext2D, modify its so that it graphs
    with 0, 0 at the center
    growing x to the right
    growing y up
     */
    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;

    var orig_fillRect = ctx.fillRect;
    ctx.fillRect = function(x, y, w, h) {
        orig_fillRect.apply(
            this,
            [
                x + sizeWidth / 2,
                sizeHeight / 2 - y - h,
                w,
                h
            ]);
    };

    var orig_moveTo = ctx.moveTo;
    ctx.moveTo = function(x, y) {
        orig_moveTo.apply(
            this,
            [
                x + sizeWidth / 2,
                sizeHeight / 2 - y
            ]);
    };

    var orig_lineTo = ctx.lineTo;
    ctx.lineTo = function(x, y) {
        orig_lineTo.apply(
            this,
            [
                x + sizeWidth / 2,
                sizeHeight / 2 - y
            ]);
    };

}

function isValidField(text) {
    try {
        eval(text);
        var someValue = field(10, 10);
        if (someValue[0] > 0 || someValue[0] < 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
}

function drawArrows(ctx) {
    ctx.fillStyle = "#FFFFFF";
    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;

    ctx.fillRect(-sizeWidth / 2, -sizeWidth / 2, sizeWidth, sizeHeight);

    ctx.fillStyle = "#0000DD";
    ctx.strokeStyle = "#0000DD";


    var spacing = 20;
    var minX = -(sizeWidth / 2.0);
    var maxX = sizeWidth / 2.0;
    var minY = -sizeHeight / 2.0;
    var maxY = sizeHeight / 2.0;

    var editor = ace.edit("editor");
    var text = editor.getValue();
    eval(text);
    for (var x = minX; x <= maxX; x+=spacing) {
        for (var y = minY; y <= maxY; y+=spacing) {
            // ctx.fillRect(x, y, 1, 1);

            var vect = field(x, y);

            drawArrow(
                ctx,
                x, y,
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


function draw(ctx) {
    drawArrows(ctx);
    // drawWing(ctx);
}

function drawWing(ctx) {
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(wing[0][0], wing[0][1]);
    for (pt of wing) {
        // console.log(pt[0], pt[1]);
        ctx.lineTo(pt[0], pt[1]);
    }
    ctx.closePath();
    ctx.fill();

}

function dist(point0, point1) {
    var x = point1[0] - point0[0];
    var y = point1[1] - point0[1];
    return Math.hypot(x, y);
}

function setupScene() {
    var points = [
        [-200, 0],
        [-100, 40],
        [100, 40],
        [200, 0]
    ];

    var midPoints = [];
    for (var i = 0; i < points.length; i++) {
        var p0 = points[i];
        var p1;
        if (i + 1 == points.length) {
            p1 = points[0];
        }
        else {
            p1 = points[i + 1];
        }
        midPoints.push([
            (p0[0] + p1[0]) / 2,
            (p0[1] + p1[1]) / 2,
        ])
    }

    wing = points;
    midPoints = midPoints;

    for (pt of midPoints) {
        console.log(pt);
    }

    var A = [];
    var b = [];
    for (var i = 0; i < points.length; i++) {
        var midpoint = midPoints[i];
        var An = [];
        for (var j = 0; j < points.length; j++) {
            var vortex = points[j];
            var d = dist(midpoint, vortex);
            console.log("DISTANCE BETWEEN", vortex, midpoint, d);
            An.push(1 / d / d);
        }
        A.push(An);
        b.push(0);
    }
    console.log("A", A);
    console.log("b", b);
    var x = numeric.solve(A, b);
    console.log("x", x);
}
