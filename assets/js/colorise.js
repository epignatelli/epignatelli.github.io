function allElements() {
    return document.getElementsByTagName('div');
}

function attribute() {
    return "background"
}

function defaultAtt() {
    return "white";
}


document.addEventListener("keydown", function() {
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        var att = attribute();
        elements[i].style[att] = defaultAtt();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function(e) {
            var h = Math.random() * 360 + 1;
            var s = Math.floor(Math.random() * 50 + 51);
            var l = Math.floor(Math.random() * 50 + 51);
            var color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
            console.log(color);
            var att = attribute();
            this.style[att] = color;
        }

        elements[i].onmousedown = function(e) {
            var elements = allElements();
            for (var i = 0; i < elements.length; i++) {
                var att = attribute();
                elements[i].style[att] = defaultAtt();
            }
        }
    }
});