const form = document.querySelector('form');
const taskInput = document.querySelector('#taskInput');
const pendingTasksList = document.querySelector('#pendingTasksList');
const completedTasksList = document.querySelector('#completedTasksList');

let tasks = [];

// Load tasks from localStorage on page load
window.addEventListener('load', () => {
  const tasksJSON = localStorage.getItem('tasks');
  if (tasksJSON) {
    tasks = JSON.parse(tasksJSON);
    renderTasks();
  }
});

// Add new task
form.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = taskInput.value.trim();
  if (taskName) {
    const task = {
      name: taskName,
      date: new Date().toISOString(),
      completed: false,
      completedDate: null
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

// Complete task
pendingTasksList.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('complete')) {
    const taskIndex = e.target.parentElement.dataset.index;
    tasks[taskIndex].completed = true;
    tasks[taskIndex].completedDate = new Date().toISOString();
    saveTasks();
    renderTasks();
  }
});

// Delete task
completedTasksList.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('delete')) {
    const taskIndex = e.target.parentElement.dataset.index;
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
  }
});

// Render tasks
function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('li');
    taskElement.dataset.index = index;
    const taskNameElement = document.createElement('span');
    taskNameElement.classList.add('name');
    taskNameElement.textContent = task.name;
    const taskDateElement = document.createElement('span');
    taskDateElement.classList.add('date');
    taskDateElement.textContent = formatDate(task.date);
    taskElement.appendChild(taskNameElement);
    taskElement.appendChild(taskDateElement);
    if (task.completed) {
      const taskCompletedDateElement = document.createElement('span');
      taskCompletedDateElement.classList.add('completed-date');
      taskCompletedDateElement.textContent = formatDate(task.completedDate);
      taskElement.appendChild(taskCompletedDateElement);
      const deleteButtonElement = document.createElement('button');
      deleteButtonElement.classList.add('delete');
      deleteButtonElement.textContent = 'Delete';
      taskElement.appendChild(deleteButtonElement);
      completedTasksList.appendChild(taskElement);
    } else {
      const completeButtonElement = document.createElement('button');
      completeButtonElement.classList.add('complete');
      completeButtonElement.textContent = 'Complete';
      taskElement.appendChild(completeButtonElement);
      pendingTasksList.appendChild(taskElement);
    }
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date string
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
