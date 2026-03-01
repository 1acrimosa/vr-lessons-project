// Конфиг уроков
const lessons = [
    { id: 'axes', title: '1. Три перпендикулярные прямые', file: 'lessons_geometry/lesson1.html' },
    { id: 'pyramid', title: '2. Координатные плоскости и октанты', file: 'lessons_geometry/lesson2.html' },
    // Добавляй новые: { id: 'name', title: 'N. Название', file: 'lessons/lessonN.html' }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initLessons();
    initRouter();
});

// Создать меню уроков
function initLessons() {
    const list = document.getElementById('lessons-list');
    lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = lesson.title;
        li.dataset.lesson = lesson.id;
        li.addEventListener('click', () => loadLesson(lesson.id));
        list.appendChild(li);
    });
}

// Загрузка урока
async function loadLesson(id) {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;

    // Активный пункт меню
    document.querySelectorAll('#lessons-list li').forEach(li => li.classList.remove('active'));
    document.querySelector(`[data-lesson="${id}"]`).classList.add('active');

    // Загрузка контента
    try {
        const response = await fetch(lesson.file);
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;
        window.history.pushState({}, lesson.title, `#${id}`);
        document.title = `${lesson.title} | 3D Уроки`;
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}

// Роутинг (URL #axes → загрузка урока)
function initRouter() {
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            loadLesson(hash);
        }
    });

    // Загрузка по URL при открытии
    if (window.location.hash) {
        const id = window.location.hash.slice(1);
        loadLesson(id);
    }
}

// Контролы для урока "плоскости"
function initPlanesControls() {
    const planes = document.getElementById('planes');
    if (!planes) return;

    // X размер (ширина плоскостей XZ и XY)
    document.getElementById('sizeX')?.addEventListener('input', (e) => {
        const x = e.target.value;
        planes.children[1].setAttribute('width', x);  // XZ плоскость
        planes.children[0].setAttribute('width', x);  // XY плоскость
        updateOctants(x, planes.getAttribute('scale').y || 4, planes.getAttribute('scale').z || 4);
    });

    // Y размер (высота плоскостей XY и YZ)
    document.getElementById('sizeY')?.addEventListener('input', (e) => {
        const y = e.target.value;
        planes.children[0].setAttribute('height', y); // XY плоскость
        planes.children[2].setAttribute('height', y); // YZ плоскость
        updateOctants(planes.getAttribute('scale').x || 4, y, planes.getAttribute('scale').z || 4);
    });

    // Z размер (ширина плоскостей YZ и XZ)
    document.getElementById('sizeZ')?.addEventListener('input', (e) => {
        const z = e.target.value;
        planes.children[1].setAttribute('height', z); // XZ плоскость
        planes.children[2].setAttribute('width', z);  // YZ плоскость
        updateOctants(planes.getAttribute('scale').x || 4, planes.getAttribute('scale').y || 4, z);
    });
}








// Обновление позиций октантов
function updateOctants(x, y, z) {
    const spheres = document.querySelectorAll('#planes a-sphere');
    const positions = [
        [x/2, y/2, z/2], [-x/2, y/2, z/2], [x/2, -y/2, z/2], [-x/2, -y/2, z/2],
        [x/2, y/2, -z/2], [-x/2, y/2, -z/2], [x/2, -y/2, -z/2], [-x/2, -y/2, -z/2]
    ];
    spheres.forEach((sphere, i) => {
        sphere.setAttribute('position', positions[i].join(' '));
    });
}

// После загрузки урока проверяем контролы
const observer = new MutationObserver(() => {
    if (document.getElementById('planes')) {
        initPlanesControls();
        observer.disconnect();
    }
});
observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });

