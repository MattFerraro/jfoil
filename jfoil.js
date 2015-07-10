var wing;
var midpoints = [];
var normals = [];
var field;

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

    // var editor = ace.edit("editor");
    // var text = editor.getValue();
    // eval(text);
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
    // drawArrows(ctx);
    drawWing(ctx);
    drawStreamlines(ctx);
}

function drawStreamlines(ctx) {
    ctx.strokeStyle = "#0000DD";

    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;
    var minX = -(sizeWidth / 2.0);
    var maxX = sizeWidth / 2.0;
    var minY = -sizeHeight / 2.0;
    var maxY = sizeHeight / 2.0;

    var lines = 30;
    for (var i = 0; i < lines; i++) {
        var scal = 0.1;
        var d = [minX + 190, i * sizeHeight / lines - maxY];

        var p = [d[0], d[1]];
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        for (k= 0; k < 500; k++) {
            var vel = field(p[0], p[1]);
            p = numeric.add(p, numeric.mul(scal, vel));
            ctx.lineTo(p[0], p[1]);

            if (p[0] > maxX || p[0] < minX || p[1] > maxY || p[1] < minY) {
                break;
            }
        }
        p = [d[0], d[1]];
        ctx.moveTo(p[0], p[1]);
        for (k= 0; k < 500; k++) {
            var vel = field(p[0], p[1]);
            p = numeric.sub(p, numeric.mul(scal, vel));
            ctx.lineTo(p[0], p[1]);

            if (p[0] > maxX || p[0] < minX || p[1] > maxY || p[1] < minY) {
                break;
            }
        }
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function drawWing(ctx) {
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(wing[0][0], wing[0][1]);
    for (pt of wing) {
        ctx.lineTo(pt[0], pt[1]);
    }
    ctx.closePath();
    ctx.fill();

}

function setupScene() {
    var uniformVelocity = [29, 0];

    var points = [];
    var slices = 80;
    var radius = 100;
    for(var i = 0; i < slices; i ++) {
        points.push([
            radius * Math.cos(i * 2*Math.PI / slices),
            radius * Math.sin(-i * 2*Math.PI / slices)
        ]);
    }
    // var points = [
    //     [-1, 100],
    //     [1, 100],
    //     [1, -100],
    //     [-1, -100]
    // ];

    for (var i = 0; i < points.length; i++) {
        var p0 = points[i];
        var p1 = (i + 1 == points.length? points[0]: points[i + 1]);
        midpoints.push(numeric.mul(.5, numeric.add(p0, p1)));

        var parallel = numeric.sub(p1, p0);
        var magP = numeric.norm2(parallel);
        var parallelUnit = numeric.mul(1/magP, parallel);
        var normal = numeric.dot([[0, -1], [1, 0]], parallelUnit);
        normals.push(normal);
    }

    wing = points;

    // var method = sourceSheet;
    var method = vortexSheet;

    var A = [];
    var b = [];
    for (var i = 0; i < points.length; i++) {
        var midpoint = midpoints[i];
        var normal = normals[i];
        var An = [];
        for (var j = 0; j < points.length; j++) {
            var sheetJoint0 = points[j];
            var sheetJoint1 = (j + 1 == points.length ? points[0]: points[j+1]);

            var vFactor = method(
                1,
                sheetJoint0[0], sheetJoint0[1],
                sheetJoint1[0], sheetJoint1[1],
                midpoint[0], midpoint[1]);
            var flux = numeric.dot(vFactor, normal);
            // console.log("midpoint", midpoint, sheetJoint0, sheetJoint1, "flux", flux);
            An.push(flux);
        }

        A.push(An);
        b.push(-numeric.dot(uniformVelocity, normal));
    }
    // console.log(A);
    var strengths = numeric.solve(A, b);

    field = function(x, y) {
        var velocity = [0, 0];
        for (var i = 0; i < points.length; i++) {
            var p0 = points[i];
            var p1 = (i + 1 == points.length? points[0]: points[i + 1]);

            velocity = numeric.add(
                velocity,
                method(
                    strengths[i],
                    p0[0], p0[1],
                    p1[0], p1[1],
                    x, y))
        }

        return numeric.add(uniformVelocity, velocity);
    }
}


function addAll(listOfPoints) {
    result = [0, 0];
    for (var pt of listOfPoints) {
        result[0] += pt[0];
        result[1] += pt[1];
    }
    return result;
}

function uniformFlow(Ux, Uy) {
    return [Ux, Uy];
}

function sourceSheet(lambda, x0, y0, x1, y1, x, y) {
    var l = Math.hypot(x1 - x0, y1 - y0);

    var X0 = [x0, y0];
    var X1 = [x1, y1];
    var X = [x, y];

    // finds the midpoint
    var M = numeric.mul(0.5, numeric.add(X0, X1));

    // points from midpoint to x1, our new x axis
    var B = numeric.sub(X1, M);

    // err...normalize that vector...
    var magB = numeric.norm2(B);
    B = numeric.mul(1/magB, B);

    // points from the midpoint up, our new y axis
    var C = numeric.dot([[0, -1], [1, 0]], B);

    // points from the midpoint of the sheet to the point x, y
    var A = numeric.sub(X, M);

    var x_tilde = numeric.dot(A, B);
    var y_tilde = numeric.dot(A, C);


    var v;
    if (y_tilde == 0) {
        y_tilde = 0.00000000001;
    }
    v = lambda / 2 / Math.PI * (Math.atan((l/2 - x_tilde) / y_tilde) - Math.atan((-l/2 - x_tilde) / y_tilde));

    var u = Math.log(Math.pow(x_tilde - l/2, 2) + y_tilde * y_tilde) - Math.log(Math.pow(x_tilde + l/2, 2) + y_tilde * y_tilde);
    u = -lambda / 4 / Math.PI * u;

    // Lastly, transform back into x, y coordinates
    return numeric.add(numeric.mul(u, B), numeric.mul(v, C));
}

function vortexSheet(gamma, x0, y0, x1, y1, x, y) {
    var l = Math.hypot(x1 - x0, y1 - y0);

    var X0 = [x0, y0];
    var X1 = [x1, y1];
    var X = [x, y];

    // finds the midpoint
    var M = numeric.mul(0.5, numeric.add(X0, X1));

    // points from midpoint to x1, our new x axis
    var B = numeric.sub(X1, M);

    // err...normalize that vector...
    var magB = numeric.norm2(B);
    B = numeric.mul(1/magB, B);

    // points from the midpoint up, our new y axis
    var C = numeric.dot([[0, -1], [1, 0]], B);

    // points from the midpoint of the sheet to the point x, y
    var A = numeric.sub(X, M);

    var x_tilde = numeric.dot(A, B);
    var y_tilde = numeric.dot(A, C);

    if (y_tilde === 0) {
        y_tilde = 0.00000000001;
    }

    var scale = gamma / 2 / Math.PI;
    var v = scale * (x_tilde / y_tilde) * (Math.atan((x_tilde - l/2) / y_tilde) - Math.atan((x_tilde + l/2) / y_tilde));
    var u = scale * (Math.atan((x_tilde + l/2) / y_tilde) - Math.atan((x_tilde - l/2) / y_tilde));

    // Lastly, transform back into x, y coordinates
    return numeric.add(numeric.mul(u, B), numeric.mul(v, C));
}
