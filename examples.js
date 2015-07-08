function field(x, y) {
    return addAll([
        pointVortex(10000, -100, 40, x, y),
        pointSource(-20000, 0, 0, x, y),
        uniformFlow(40, 0)
    ]);
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
        -scale * yf / (xf * xf + yf * yf)];
}

function addAll(listOfPoints) {
    result = [0, 0];
    for (pt of listOfPoints) {
        result[0] += pt[0];
        result[1] += pt[1];
    }
    return result;
}
