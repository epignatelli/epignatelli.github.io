function getRandomMatrixChar() {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function getRandomColor() {
    const h = Math.random() * 360;
    const s = Math.floor(Math.random() * 50 + 50);
    const l = Math.floor(Math.random() * 50 + 50);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function soberUp() {
    document.canTrip = false;
}

function tripUp() {
    document.canTrip = true;
}

function freezeUp(e) {
    if (e.target.id === "init" || e.target.id === "reset") return;
    document.canTrip = false;
}

function setup(pills) {
    document.addEventListener("mousedown", freezeUp);
    document.addEventListener("keydown", function (e) {
        soberUp();
        document.getElementById("enter")?.style.setProperty("opacity", "0.0");
        pills.forEach(trip => trip.reset());
    });
    document.addEventListener("DOMContentLoaded", function () {
        pills.forEach(trip => trip.subscribe());
        document.getElementById("reset")?.addEventListener("mousedown", () => {
            pills.forEach(trip => trip.reset());
            soberUp();
        });;
        document.getElementById("init")?.addEventListener("mousedown", tripUp);
    });
}

backgroundPill = function () {
    const cache = new WeakMap();
    function elements() {
        return document.querySelectorAll("h1, h2, h3, h4, h5, p, span, ul, ol, li, span:not([id=reset])");
    }
    function trip(element) {
        if (!document.canTrip) return;
        if (!cache.has(element)) {
            cache.set(element, element.style.background);
        }
        element.style.background = getRandomColor();
    }
    function sober(element) {
        if (cache.has(element)) {
            element.style.background = cache.get(element);
        }
    }
    function subscribe() {
        elements().forEach(element => {
            element.addEventListener("mouseover", function () {
                trip(this);
            });
        });
    }
    function reset() {
        elements().forEach(element => sober(element));
    }
    return {
        elements: elements, trip: trip, sober: sober, subscribe: subscribe, reset: reset
    }
}

glitchPill = function () {
    const cache = new WeakMap();
    function elements() {
        return document.querySelectorAll("h1, h2, h3, h4, h5, p, span, ul, ol, li, span:not([id=reset])");
    }
    function trip(element) {
        if (!document.canTrip || element.classList.contains("grid")) return;
        if (!element._originalText) {
            element._originalText = element.innerHTML;
            element._originalStyles = element.getAttribute("style") || "";
        }
        element.style.transition = 'none';
        // element.style.color = '#00ffae';
        // element.style.backgroundColor = 'black';
        // element.style.fontFamily = 'monospace';
        // element.style.letterSpacing = '1px';
        element.classList.add("matrix-flicker");

        if (!element._tripInterval) {
            element._tripInterval = setInterval(() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = element._originalText;
                const visibleText = tempDiv.textContent || tempDiv.innerText || "";
                let filtered = '';
                for (let i = 0; i < visibleText.length; i++) {
                    const char = visibleText[i];
                    filtered += /[a-zA-Z0-9]/.test(char) ? getRandomMatrixChar() : char;
                }
                const targetLength = Math.floor(filtered.length);
                let newText = filtered.slice(0, targetLength);
                function replaceTextPreservingHTML(element, scrambledText) {
                    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
                    let index = 0;
                    while (walker.nextNode()) {
                        const textNode = walker.currentNode;
                        const original = textNode.nodeValue;
                        let newValue = '';
                        for (let i = 0; i < original.length; i++) {
                            const char = original[i];
                            if (/[a-zA-Z0-9]/.test(char) && index < scrambledText.length) {
                                newValue += scrambledText[index++];
                            } else {
                                newValue += char;
                                if (/[a-zA-Z0-9]/.test(char)) index++;
                            }
                        }
                        textNode.nodeValue = newValue;
                    }
                }
                replaceTextPreservingHTML(element, newText);
            }, 125);
        }
    }
    function sober(element) {
        if (element._tripInterval) {
            clearInterval(element._tripInterval);
        }
        element._tripInterval = null;
        if (element._originalText) {
            element.innerHTML = element._originalText;
            element._originalText = null;
        }
        if (element._originalStyles !== undefined) {
            element.setAttribute("style", element._originalStyles);
            element._originalStyles = null;
        } else {
            element.removeAttribute("style");
        }
        element.classList.remove("matrix-flicker");
    }
    function subscribe() {
        elements().forEach(element => {
            element.addEventListener("mouseover", function () {
                trip(this);
            });
        });
    }
    function reset() {
        elements().forEach(element => sober(element));
    }
    return {
        elements: elements, trip: trip, sober: sober, subscribe: subscribe, reset: reset
    }
}

// run
document.canTrip = false;
document.isTrippin = false;
var pills = [
    glitchPill(),
];
setup(pills);
