'use strict';

let habbits = [];
const HABBITS_KEY = 'HABBITS_KEY';
const GLOBAL_ACTIVE_HABBIT_ID = "GLOBAL_ACTIVE_HABBIT_ID";
let globalActiveHabbitId;

/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    main: {
        days: document.getElementById('days'),
        habbitAddDay: document.getElementById('day-add')
    },
    popup: {
        cover: document.querySelector('.cover'),
        iconFild: document.querySelector('.popup__form input[name="icon"]')
    }
};

/* utils */
function loudData() {
    const globalId = localStorage.getItem(GLOBAL_ACTIVE_HABBIT_ID);
    if (globalId) {
        globalActiveHabbitId = Number(globalId);
    }
    const stringHabbits = localStorage.getItem(HABBITS_KEY);
    const arrayHabbits = JSON.parse(stringHabbits);
    if (Array.isArray(arrayHabbits)) {
        habbits = arrayHabbits;
    }
}

function saveData() {
    localStorage.setItem(HABBITS_KEY, JSON.stringify(habbits));
    localStorage.setItem(GLOBAL_ACTIVE_HABBIT_ID, globalActiveHabbitId);
}

function globalExceptionHendler(form, fildName, value) {
    form[fildName].classList.remove('input_error');
    if (!value) {
        form[fildName].classList.add('input_error');
        return true;
    }
    return false;
}

/* rendering */
function rerenderMenu(activeHabbit) {
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
    page.header.h1.innerText = activeHabbit.name;

    const progress = (Math.round((activeHabbit.days.length / activeHabbit.target) * 100) / 100) * 100;
    const percent = progress > 100 ? 100 : progress;
    page.header.progressPercent.innerText = `${percent.toFixed(0)}%`;
    page.header.progressCoverBar.style.width = `${percent.toFixed(0)}%`;
}

function rerenderMain(activeHabbit) {
    page.main.days.innerHTML = '';
    if (activeHabbit.days.length === 0) {
        page.main.habbitAddDay.innerText = 'День 1';
        return;
    }

    for (let i = 0; i < activeHabbit.days.length; i++) {
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${i + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[i].comment}</div>
        <button class="habbit__delete" onclick="deleteDay(${i})">
            <img src="img/delete.svg" alt="Удалить день">
        </button>`;
        page.main.days.appendChild(element);
    }
    page.main.habbitAddDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderMain(activeHabbit);
}

/* work with days*/
function addDay(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const comment = data.get('comment');
    /*
    const habbitId = Number(document.querySelector('.menu__item_active').getAttribute('menu-habbit-id'));
    const existed = habbits.find(habbit => habbit.id === habbitId);
    if (existed) {
        existed.days.push({comment});
        saveData();
        rerender(existed);
    }
    */
    if (globalExceptionHendler(form, 'comment', comment)) {
        return;
    }
    habbits.find(habbit => habbit.id === globalActiveHabbitId).days.push({comment});
    form['comment'].value = '';
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(index) {
    habbits.find(habbit => habbit.id === globalActiveHabbitId)
    .days.splice(index, 1);
    rerender(globalActiveHabbitId);
    saveData();
}

/* popup */
function toggelPopup() {
    if (page.popup.cover.classList.contains('cover_hidden')) {
        page.popup.cover.classList.remove('cover_hidden');
    } else {
        page.popup.cover.classList.add('cover_hidden');
    }
}

function setIcon(context, icon) {
    page.popup.iconFild.value = icon;
    document.querySelector('.icon_active').classList.remove('icon_active');
    context.classList.add('icon_active');
}

function addHabbit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const name = data.get('name');
    let target = data.get('target');
    const icon = data.get('icon');
    if (globalExceptionHendler(form, 'name', name)) {
        return;
    }
    if (globalExceptionHendler(form, 'target', target)) {
        return;
    }
    
    target = Number(target);

    const habbit = {
        id: getNextId(),
        icon,
        name,
        target,
        days: []
    }
    habbits.push(habbit);
    form['name'].value = '';
    form['target'].value = '';
    toggelPopup();
    rerender(globalActiveHabbitId);
    saveData();
}

function getNextId() {
    let lastId = habbits.slice(-1)[0].id;
    return ++lastId;
}

/* init */
(() => {
    loudData();
    rerender(globalActiveHabbitId ? globalActiveHabbitId : habbits[0].id);
})();