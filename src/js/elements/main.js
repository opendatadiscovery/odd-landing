'use strict'

/* let clicker = document.querySelectorAll('.click');
let hidden = document.querySelectorAll('.hidden'); */

let view = function(n) {
    style = document.getElementById(n).style;
    style.display = (style.display == 'block') ? 'none' : 'block';
}

onclick="view('hidden1'); return false"

/* clicker.onclick = function() {
    hidden.classList.toggle('shown')
} */

