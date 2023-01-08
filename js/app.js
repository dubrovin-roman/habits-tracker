'use strict';

let habbits = [];
const HABBITS_KEY = 'HABBITS_KEY';

/* utils */
function loudData() {
    const stringHabbits = localStorage.getItem(HABBITS_KEY);
    const arrayHabbits = JSON.parse(stringHabbits);
    if (Array.isArray(arrayHabbits)) {
        habbits = arrayHabbits;
    }
}

function saveData() {
    localStorage.setItem(HABBITS_KEY, JSON.stringify(habbits));
}

/* init */
(() => {
    loudData();
})();