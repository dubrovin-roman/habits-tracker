'use strict';

let habbits = [];
const HABBITS_KEY = 'HABBITS_KEY';

/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    }
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

function rerenderHead(activeHabbit) {
    if (!activeHabbit) {
        return;
    }

    page.header.h1.innerText = activeHabbit.name;

    const progress = (Math.round((activeHabbit.days.length / activeHabbit.target) * 100) / 100) * 100;
    const percent = progress > 100 ? 100 : progress;
    page.header.progressPercent.innerText = `${percent}%`;
    page.header.progressCoverBar.style.width = `${percent}%`;
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
}

/* init */
(() => {
    loudData();
    rerender(habbits[0].id);
})();