const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addButton = document.querySelector("button");
const dueDateInput = document.getElementById("due-date");
const darkToggle = document.getElementById("dark-toggle");


let tasks = [];

// Load saved tasks on startup
loadTasks();
renderTasks();

// Add task on button click
addButton.addEventListener("click", addTask);

// Add task on Enter key
inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("welcome-screen").style.display = "none";
        document.getElementById("main-app").style.display = "block";
    }, 4000); // 4 seconds splash duration
});

function addTask() {
    const taskText = inputBox.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        text: taskText,
        completed: false,
        dueDate: dueDate || null,
        priority: "normal"
    };

    tasks.push(newTask);
    inputBox.value = "";
    dueDateInput.value = "";
    saveData();
    renderTasks();
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkToggle.checked = true;
}

darkToggle.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});

function renderTasks() {
    listContainer.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        // Task text
        const textNode = document.createElement("span");
        textNode.textContent = task.text;
        taskInfo.appendChild(textNode);

        // Due date
        if (task.dueDate) {
            const dateNode = document.createElement("small");
            dateNode.textContent = `(Due: ${task.dueDate})`;
            taskInfo.appendChild(dateNode);
        }

        li.appendChild(taskInfo);

        if (task.completed) {
            li.classList.add("checked");
        }

        const span = document.createElement("span");
        span.textContent = "\u00d7";
        span.classList.add("delete");

        li.addEventListener("click", function () {
            task.completed = !task.completed;
            saveData();
            renderTasks();
        });

        span.addEventListener("click", function (e) {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveData();
            renderTasks();
        });

        li.appendChild(span);
        listContainer.appendChild(li);
    });
}

function saveData() {
    localStorage.setItem("todoData", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("todoData");
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

