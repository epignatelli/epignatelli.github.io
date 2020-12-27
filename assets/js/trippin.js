function getRandomColor() {
    var h = Math.random() * 360 + 1;
    var s = Math.floor(Math.random() * 50 + 51);
    var l = Math.floor(Math.random() * 50 + 51);
    var color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
    return color;
}

function soberUp() {
    document.canTrip = false;
}
function tripUp() {
    document.canTrip = true;
}
function freezeUp(e) {
    if (e.target.id == "init" || e.target.id == "reset"){
        return;
    }
    document.canTrip = false;
}

function setup(pills) {
    // freezes all elements with click on canvas
    document.addEventListener("mousedown", freezeUp);
    // reset all elements with key down
    document.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            soberUp();
            document.getElementById("enter").style["opacity"] = 0.0;
            pills.forEach(trip => trip.reset());
        }
        else if (e.key == "Escape") {
            if (document.canTrip){
                document.getElementById("enter").style["opacity"] = 1.0;
            }
        }
    });
    // register event on page load
    document.addEventListener("DOMContentLoaded", function() {
        // subscribe to pills
        pills.forEach(trip => trip.subscribe());
        // stop tripping at reset button
        var reset = document.getElementById("reset");
        reset.onmousedown = function(e) {
            soberUp();
            pills.forEach(trip => trip.reset())
        };
        // start tripping on init click
        var init = document.getElementById("init");
        init.onmousedown = tripUp;

    });
}

/**** Pills ****/
backgroundPill = function() {
    cache = {};
    function elements() {
        return document.querySelectorAll('*');
    }
    function trip(element) {
        if (!document.canTrip) return;
        if (element.className.includes("exclude")) return;
        element.style["background"] = getRandomColor();
    }
    function sober(element) {
        element.style["background"] = cache[element];
    }
    function subscribe() {
        elements().forEach(element => {
            element.onmouseover = function(e) {
                if (!(this in cache)) {
                    cache[this] = element.style["background"];
                }
                trip(this);
            }
        });
    }
    function reset() {
        elements().forEach(element => {
                sober(element);
        });
    }
    return {
        elements: elements, trip: trip, sober: sober, subscribe: subscribe, reset: reset
    }
}
glitchPill = function() {
    function elements() {
        return document.querySelectorAll("h1, h2, h3, p, span, span:not([id=reset])");
    }
    function trip(element) {
        if (!document.canTrip) return;
        if (element.classList.contains("grid")) return;
        element.classList.add("glitch");
    }
    function sober(element) {
        element.classList.remove("glitch");
    }
    function subscribe() {
        elements().forEach(element => {
            element.onmouseover = function(e) {
                trip(this);
            }
            element.onmouseleave = function(e) {
                sober(this)
            }
        });
    }
    function reset() {
        elements().forEach(element => {
                sober(element);
        });
    }
    return {
        elements: elements, trip: trip, sober: sober, subscribe: subscribe, reset: reset
    }
}
shufflePill = function() {
    function elements() {
        return document.querySelectorAll("h1, h2, h3, p, span, span:not([id=reset])");
    }
    function trip(element) {
        if (!document.canTrip) return;
        if (element.classList.contains("grid")) return;
        element.classList.add("glitch");
    }
}

// run
document.canTrip = false;
document.isTrippin = false;
var pills = [
    backgroundPill(),
    glitchPill()
]
setup(pills);
