// ============ 1. НАХОДИМ ЭЛЕМЕНТЫ ============

const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const list = document.getElementById('habits-list');
const counter = document.getElementById('habits-counter');
const errorEl = document.getElementById('habits-error');
const MAX_LEGTH = 50;
// ============ 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ ============

// Массив привычек. Каждая — объект { id, name, done }
let habits = [];

// Ключ, под которым данные лежат в localStorage
const STORAGE_KEY = 'habits';

// ============ 3. РАБОТА С ХРАНИЛИЩЕМ ============

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function loadHabits() {
  const saved = localStorage.getItem(STORAGE_KEY);
  habits = saved ? JSON.parse(saved) : [];
}

// ============ 4. СОЗДАНИЕ ЭЛЕМЕНТА ПРИВЫЧКИ ============

function createHabitElement(habit) {
  const li = document.createElement('li');
  li.className = 'habit';
  li.dataset.id = habit.id;

  li.innerHTML = `
    <label class="habit__label">
      <input type="checkbox" class="habit__checkbox" ${habit.done ? 'checked' : ''}>
      <span class="habit__name"></span>
    </label>
    <button class="habit__delete" aria-label="Удалить привычку">×</button>
  `;

  // Имя вставляем через textContent — защита от HTML-инъекций
  li.querySelector('.habit__name').textContent = habit.name;

  // Обработчик чекбокса — переключить done
  const checkbox = li.querySelector('.habit__checkbox');
  checkbox.addEventListener('change', () => {
    habit.done = checkbox.checked;
    saveHabits();
    updatecounter();
  });

  // Обработчик кнопки удаления
  const deleteBtn = li.querySelector('.habit__delete');
  deleteBtn.addEventListener('click', () => {
    habits = habits.filter(h => h.id !== habit.id);
    li.remove();
    saveHabits();
    updatecounter();
  });

  return li;
}



// ============ 5. ОТРИСОВКА ВСЕГО СПИСКА ============

function renderHabits() {
  list.innerHTML = '';
  habits.forEach(habit => {
    list.appendChild(createHabitElement(habit));
  });
  updatecounter();
}

// ============ 6. ДОБАВЛЕНИЕ НОВОЙ ПРИВЫЧКИ ============

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = input.value.trim();

  // Проверка 1: пустое поле
  if (!name) {
    errorEl.textContent = 'Введите название привычки';
    return;
  }

  // Проверка 2: слишком длинное
  if (name.length > MAX_LENGTH) {
    errorEl.textContent = `Максимум ${MAX_LENGTH} символов, у вас ${name.length}`;
    return;
  }

  // Всё ок — очищаем ошибку и добавляем
  errorEl.textContent = '';

  const newHabit = {
    id: Date.now().toString(),
    name: name,
    done: false
  };

  habits.push(newHabit);
  list.appendChild(createHabitElement(newHabit));
  saveHabits();
  updateCounter();

  input.value = '';
  input.focus();
});

function updatecounter() {
  const done = habits.filter(h => h.done).length;
  const total = habits.length;
  counter.textContent = `Выполнено ${done} из ${total}`;
}

// ============ 7. СТАРТ ============

loadHabits();
renderHabits();