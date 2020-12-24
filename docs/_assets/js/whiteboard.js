import keys from "./keys";

// main
var isActive = false;
var plots = [];
var channel = 'epignatelli.com';

var pubnub = PUBNUB.init({
    publish_key: keys.pubnub_pub,
    subscribe_key: keys.pubnub_subscribe,
    ssl: true
});

pubnub.publish({
    channel: channel,
    message: {
        plots: plots // your array goes here
    }
});

pubnub.subscribe({
    channel: channel,
    callback: drawFromStream
});


// function
function getCanvas() {
    return canvas = document.getElementById("whiteboard");
}

function init() {
    canvas = getCanvas()
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    var ctx = canvas.getContext('2d');
    ctx.lineWidth = '3';

    canvas.addEventListener('mousedown', startDraw, false);
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', endDraw, false);
}

function draw(e) {
    if (!isActive) return;

    // cross-browser canvas coordinates
    var x = e.offsetX || e.layerX - canvas.offsetLeft;
    var y = e.offsetY || e.layerY - canvas.offsetTop;

    plots.push({ x: x, y: y });

    drawOnCanvas(plots);
}

function drawOnCanvas(color, plots) {
    ctx.beginPath();
    ctx.moveTo(plots[0].x, plots[0].y);

    for (var i = 1; i < plots.length; i++) {
        ctx.lineTo(plots[i].x, plots[i].y);
    }
    ctx.stroke();
}

function startDraw(e) {
    isActive = true;
}

function endDraw(e) {
    isActive = false;

    // empty the array
    plots = [];
}

function drawFromStream(message) {
    if(!message) return;

    ctx.beginPath();
    drawOnCanvas(message.plots);
}