document.canHaveFun = false;

function getRandomColor() {
    var h = Math.random() * 360 + 1;
    var s = Math.floor(Math.random() * 50 + 51);
    var l = Math.floor(Math.random() * 50 + 51);
    var color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
    return color;
}

function allElements() {
    return document.getElementsByTagName('div');
}

function isExcluded (element) {
    if (element == undefined) {
        return false;
    }
    return element.className.includes("exclude");
}

function resetElement (element) {
    element.style["background"] = "white";
}

function resetAll() {
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        resetElement(elements[i]);
    }
}

function freeze(e) {
    if (e.target.id == "init" || e.target.id == "reset"){
        return;
    }
    document.canHaveFun = !document.canHaveFun;
}

function beSerious(e) {
    document.canHaveFun = false;
    resetAll();
}

function beFunny(e) {
    document.canHaveFun = true;
}

// reset all elements with key down
document.addEventListener("keydown", function(e) {
    if (e.key == "Escape") {
        beSerious();
    }
    else {
        resetAll();
    }
});

// freezes all elements with click on canvas
document.addEventListener("mousedown", freeze);

// register event on page load
document.addEventListener("DOMContentLoaded", function() {
    // stop being messy if click on reset
    var reset = document.getElementById("reset");
    reset.onmousedown = beSerious;
    var init = document.getElementById("init");
    init.onmousedown = beFunny;

    // colorise if hover on div
    var elements = allElements();
    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function(e) {
            if (!document.canHaveFun) {
                return;
            }
            if (isExcluded(this)) {
                return;
            }
            this.style["background"] = getRandomColor();
            this.style["transition"] = "0.3s";
        }
    }
});