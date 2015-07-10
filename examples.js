function field(x, y) {
    var scal = 1;
    return addAll([
        sourceSheet(scal * 100, -200, 0, 200, 0, x, y)
    ]);
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

	if (y_tilde === 0) {
		return sourceSheet(lambda, x0, y0, x1, y1, x+0.00001, y);
	}

	var scale = lambda / 2 / Math.PI;
	var v = scale * (Math.atan((l/2 - x_tilde) / y_tilde) - Math.atan((-l/2 - x_tilde) / y_tilde));
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
		return vortexSheet(gamma, x0, y0, x1, y1, x+0.00001, y);
	}

	var scale = gamma / 2 / Math.PI;
	var v = scale * (x_tilde / y_tilde) * (Math.atan((x_tilde - l/2) / y_tilde) - Math.atan((x_tilde + l/2) / y_tilde));
	var u = scale * (Math.atan((x_tilde + l/2) / y_tilde) - Math.atan((x_tilde - l/2) / y_tilde));

	// Lastly, transform back into x, y coordinates
	return numeric.add(numeric.mul(u, B), numeric.mul(v, C));
}



function pointVortex(gamma, X, Y, x, y) {
    var scale = gamma / 2 / Math.PI;
    xf = x - X;
    yf = y - Y;
    return [
        scale * yf / (xf * xf + yf * yf),
        -scale * xf / (xf * xf + yf * yf)];
}

function uniformFlow(Ux, Uy) {
    return [Ux, Uy];
}

function pointSource(lambda, X, Y, x, y) {
    var scale = lambda / 2 / Math.PI;
    xf = x - X;
    yf = y - Y;
    return [
        scale * xf / (xf * xf + yf * yf),
        scale * yf / (xf * xf + yf * yf)];
}

function addAll(listOfPoints) {
    result = [0, 0];
    for (var pt of listOfPoints) {
        result[0] += pt[0];
        result[1] += pt[1];
    }
    return result;
}
