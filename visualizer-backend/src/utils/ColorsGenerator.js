var hslMax = 330;

function getRandomHue() {
    return Math.floor(Math.random() * (hslMax + 1));
}

export function generateColors(prefixes) {
    var colors = [];
    var len = prefixes.length;
    var used = [];
    for (var i = 0; i < len; i++) {
        var hue = getRandomHue();
        while (used.indexOf(hue) > -1) {
            hue = getRandomHue();
        }
        used.push(hue);
        colors[prefixes[i].prefix] = {
            hue: hue,
            saturation: 60,
            lightness: 50
        };
    }
    return colors;
}