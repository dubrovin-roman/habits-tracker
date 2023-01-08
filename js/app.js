'use strict';

let habbits = [];
const HABBITS_KEY = 'HABBITS_KEY';

/* page */
const page = {
    menu: document.querySelector('.menu__list')
};

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

/* rendering */

function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }

    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existed) {
            //создание
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img src="img/${habbit.icon}.svg" alt="${habbit.icon}">`;
            if (habbit.id === activeHabbit.id) {
                element.classList.add('menu__item_active');
            }
            page.menu.appendChild(element);
            continue;
        }

        if (habbit.id === activeHabbit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }

}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}

/* init */
(() => {
    loudData();
    rerender(habbits[0].id);
})();