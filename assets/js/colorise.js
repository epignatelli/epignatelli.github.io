document.stopHavingFun = false;

function allElements() {
    return document.getElementsByTagName('div');
}

function exclude (element) {
    if (element == undefined) {
        return false;
    }
    return element.className.includes("exclude");
}

function attribute() {
    return "background"
}

function defaultAtt() {
    return "white";
}

function resetElement (element) {
    var att = attribute();
    element.style[att] = defaultAtt();
}

// reset all elements with key down
document.addEventListener("keydown", function() {
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        resetElement(elements[i]);
    }
});

// reset all elements with click on canvas
document.addEventListener("mousedown", function() {
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        resetElement(elements[i]);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // stop being messy if click on reset
    var reset = document.getElementById("reset");
    reset.onmousedown = function(e) {
        document.stopHavingFun = !document.stopHavingFun;
        var elements = allElements();
        for (var i = 0; i < elements.length; i++) {
            resetElement(elements[i]);
        }
    }

    // colorise if hover on div
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function(e) {
            if (document.stopHavingFun) {
                return;
            }
            if (exclude(this)) {
                return;
            }
            var h = Math.random() * 360 + 1;
            var s = Math.floor(Math.random() * 50 + 51);
            var l = Math.floor(Math.random() * 50 + 51);
            var color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
            var att = attribute();
            this.style[att] = color;
            // this.style["transition-delay"] = "0.3s";
        }
    }
});