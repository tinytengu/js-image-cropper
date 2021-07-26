const KEY_SHIFT = 16;
const KEY_ALT = 18;

var KEYS = [];

// window.addEventListener('load', function() {
//     setInterval(function() {
//         console.log(KEYS);
//     }, 1000);
// });

window.addEventListener('keydown', function(e) {
    KEYS[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function(e){
    KEYS[e.keyCode] = false;
}, false);