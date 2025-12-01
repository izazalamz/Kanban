let tasksData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
let draggedElement = null;
const columns = [todo, progress, done];

function addTask(title, description, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;
    column.appendChild(div);
    div.addEventListener("drag", (e) => {
        draggedElement = div;
    });
    const deleteButton = div.querySelector('button');
    deleteButton.addEventListener('click', () => {
        div.remove();
        updateTaskCounts();
    });
    return div;
}
function updateTaskCounts() {
    columns.forEach(col => {
            const tasks = col.querySelectorAll('.task');
            const count = col.querySelector('.right');
            tasksData[col.id] = Array.from(tasks).map(t => {
                return {
                    title: t.querySelector('h2').innerText,
                    description: t.querySelector('p').innerText
                }
            }
            )
            localStorage.setItem('tasks', JSON.stringify(tasksData));
            count.innerText = tasks.length;
        }); 
}


if (localStorage.getItem('tasks')) {
    const data = JSON.parse(localStorage.getItem('tasks'));
    tasksData = data;
    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.description, column);
        });
    }
    updateTaskCounts();
}

function addDragEventsOnColumn(column) {
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");  
    });
    column.addEventListener("dragleave", (e) => {
        column.classList.remove("hover-over");  
    });
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
        e.preventDefault();
        console.log("dropped", draggedElement, column);
        column.appendChild(draggedElement);
        column.classList.remove("hover-over");
        updateTaskCounts();
    });
}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton = document.querySelector('#toggle-modal');
const modalBg = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});
modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector('#task-title-input').value;
    const taskDescription = document.querySelector('#task-description-input').value;
    
    if (taskTitle.trim() === '' || taskDescription.trim() === '') {
        alert('Please fill in both title and description');
        return;
    }

    addTask(taskTitle, taskDescription, todo);
    updateTaskCounts();
    
    document.querySelector('#task-title-input').value = '';
    document.querySelector('#task-description-input').value = '';
    modal.classList.remove("active");
});