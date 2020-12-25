document.addEventListener("DOMContentLoaded", function() {
    var elements = document.getElementById('title');
    console.log(elements)
    var s_min = 20;
    var s_max= 70;
    var l_min = 30;
    var l_max = 90;

    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function(e) {
            var h = Math.floor(Math.random()*360)
            var s = Math.max([Math.min([Math.random() * 100, s_min]), s_max])
            var l = Math.max([Math.min([Math.random() * 100, l_min]), l_max])
            var color = "hsl(" + h + "," + s + "%, " + l + "%) !important"
            console.log(h, s, l, color)
            this.style['color'] = color;
        }
    }
});