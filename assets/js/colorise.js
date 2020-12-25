document.addEventListener("DOMContentLoaded", function() {
    var elements = document.getElementsByTagName('div');
    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function(e) {
            var h = Math.random() * 360 + 1;
            var s = Math.floor(Math.random() * 50 + 51);
            var l = Math.floor(Math.random() * 50 + 51);
            var color = 'hsl(' + h + ',' + s + '%,' + l + '%)';
            console.log(color);
            this.style['background'] = color;
        }
    }
});