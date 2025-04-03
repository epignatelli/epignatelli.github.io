const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

function setup() {
    var pills = [
        glitchPill(),
    ];
    document.addEventListener("mousedown", function (e) {
        const isInit = e.target.id === "init";
        if (!isInit && document.canTrip) {
            soberUp();
            pills.forEach(trip => trip.reset());
        }
    });
    // document.addEventListener("mousedown", freezeUp);
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
        if (!document.canTrip || element.classList.contains("grid") || (element.id && element.id == "reset")) return;
        if (!element._originalText) {
            element._originalText = element.innerHTML;
            element._originalStyles = element.getAttribute("style") || "";
        }
        // element.style.transition = 'none';
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
            }, 25);
        }
    }
    function sober(element) {
        if (element._tripInterval) {
            clearInterval(element._tripInterval);
        }
        element._tripInterval = null;

        if (element._originalText) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = element._originalText;
            const targetText = tempDiv.textContent || tempDiv.innerText || "";

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            let index = 0;
            const maxSteps = 5;
            const stepSize = Math.ceil(targetText.length / maxSteps);
            const interval = setInterval(() => {
                let scrambled = '';
                for (let i = 0; i < targetText.length; i++) {
                    scrambled += i < index ? targetText[i] : getRandomMatrixChar();
                }

                let charIndex = 0;
                for (const node of textNodes) {
                    let newValue = '';
                    for (let i = 0; i < node.nodeValue.length; i++) {
                        newValue += scrambled[charIndex++] || '';
                    }
                    node.nodeValue = newValue;
                }

                index += stepSize;
                if (index >= targetText.length) {
                    clearInterval(interval);
                    element.innerHTML = element._originalText;
                    element._originalText = null;

                    if (element._originalStyles !== undefined) {
                        element.setAttribute("style", element._originalStyles);
                        element._originalStyles = null;
                    } else {
                        element.removeAttribute("style");
                    }
                    element.classList.remove("matrix-flicker");
                }
            }, 25);
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

// run
document.canTrip = false;
document.isTrippin = false;

// Add trip hint message
const tripHint = document.createElement('div');
tripHint.textContent = "ESC the matrix";
tripHint.id = "trip-hint";
tripHint.style.position = "fixed";
tripHint.style.top = "20px";
tripHint.style.left = "50%";
tripHint.style.transform = "translateX(-50%)";
tripHint.style.padding = "8px 16px";
tripHint.style.color = "blue";
tripHint.style.fontSize = "14px";
tripHint.style.fontWeight = "bold";
tripHint.style.borderRadius = "6px";
tripHint.style.zIndex = "1000";
tripHint.style.display = "none";
window.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(tripHint);
});

// Show/hide based on trip state
const originalTripUp = tripUp;
tripUp = function () {
    originalTripUp();
    tripHint.style.display = "block";
};

const originalSoberUp = soberUp;
soberUp = function () {
    originalSoberUp();
    tripHint.style.display = "none";
};

setInterval(() => {
    if (!document.canTrip) return;
    if (Math.random() < 0.8) return; // random chance to skip glitch cycle
    const hint = document.getElementById("trip-hint");
    if (!hint || !hint.textContent) return;
    const original = "ESC the matrix";
    const chars = original.split('');
    const glitchIndices = [];
    for (let i = 0; i < chars.length; i++) {
        if (/[a-zA-Z]/.test(chars[i]) && Math.random() < 0.2) {
            glitchIndices.push(i);
        }
    }
    const glitched = chars.map((c, i) => glitchIndices.includes(i) ? getRandomMatrixChar() : c).join('');
    hint.textContent = glitched;
    setTimeout(() => {
        hint.textContent = original;
    }, 200);
}, 220);

// Hover glitch effect on individual characters
function setupHoverGlitch() {
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    document.querySelectorAll('h1, h2, h3, h4, h5, p, ol, ul, li, span, a').forEach(el => {
        if (el.classList.contains("matrix-glitched") || el.id === "init" || el.id === "reset" || el.id === "author") return;
        el.classList.add("matrix-glitched");

        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (/\s+/.test(word)) {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const span = document.createElement("span");
                        span.textContent = word;

                        span.addEventListener("mouseenter", () => {
                            if (span._glitching) return;
                            span._glitching = true;

                            const originalText = span.textContent;
                            const glitchText = originalText.split('')
                                .map(char => matrixChars[Math.floor(Math.random() * matrixChars.length)])
                                .join('');

                            span.textContent = glitchText;
                            span.style.textShadow = '1px 0 red, -1px 0 lime';
                            span.style.transform = 'translate(1px, -1px) scale(-1, 1)';
                            span.style.transition = 'transform 0.05s ease, text-shadow 0.05s ease';

                            setTimeout(() => {
                                span.textContent = originalText;
                                span.style.textShadow = '';
                                span.style.transform = '';
                                span._glitching = false;
                            }, 80);
                        });

                        fragment.appendChild(span);
                    }
                });

                node.replaceWith(fragment);
            }
        });
    });
}

function glitchCharSpan(charSpan) {
    const originalChar = charSpan.textContent;
    const randomChar = originalChar.split('')
        .map(char => matrixChars[Math.floor(Math.random() * matrixChars.length)])
        .join('');
    charSpan.style.transition = 'transform 0.2s ease, text-shadow 0.2s ease';
    charSpan.style.transform = 'scaleX(-1)';
    charSpan.textContent = randomChar;
    charSpan.style.textShadow = '1px 0 red, -1px 0 lime';
    setTimeout(() => {
        charSpan.style.transform = '';
        charSpan.textContent = originalChar;
        charSpan.style.textShadow = '';
    }, 80);
}

window.addEventListener("load", () => {
    setupHoverGlitch();

    const authorName = document.getElementById("author-name");
    const authorSurname = document.getElementById("author-surname");
    if (authorName) {
        setInterval(() => {
            if (Math.random() < 0.5) return; // random chance to skip glitch cycle
            glitchCharSpan(authorName);
        }, 1000);
    }
    if (authorSurname) {
        setInterval(() => {
            if (Math.random() < 0.5) return; // random chance to skip glitch cycle
            glitchCharSpan(authorSurname);
        }, 1000);
    }
});


setup();

