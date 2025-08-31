class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadTasks();
        this.loadTheme();
        this.setupEventListeners();
        this.createBackgroundAnimation();
        this.render();
        
        // Hide welcome screen after 4 seconds
        setTimeout(() => {
            document.getElementById('welcome-screen').style.display = 'none';
        }, 4000);
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const prioritySelect = document.getElementById('prioritySelect');

        const text = taskInput.value.trim();
        if (!text) {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            dueDate: dueDateInput.value || null,
            priority: prioritySelect.value,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();

        // Clear inputs
        taskInput.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'medium';

        this.showNotification('Task added successfully!', 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
        this.showNotification('Task deleted!', 'success');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(t => t.completed);
            case 'pending':
                return this.tasks.filter(t => !t.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        this.updateStats();
        this.renderTasks();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('pending-tasks').textContent = pending;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        taskList.style.display = 'block';
        emptyState.style.display = 'none';

        taskList.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');
    }

    createTaskElement(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

        return `
            <li class="task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="taskManager.toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        ${dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">${dueDate} ${isOverdue ? '⚠️' : ''}</span>` : ''}
                    </div>
                </div>
                <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">×</button>
            </li>
        `;
    }

    toggleTheme() {
        const body = document.body;
        const toggle = document.getElementById('themeToggle');
        const isDark = body.classList.toggle('dark-mode');
        toggle.classList.toggle('active', isDark);
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').classList.add('active');
        }
    }

    saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow-tasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    createBackgroundAnimation() {
        const bgAnimation = document.getElementById('bgAnimation');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 6;
            const animationDuration = Math.random() * 3 + 3;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${animationDelay}s;
                animation-duration: ${animationDuration}s;
            `;

            bgAnimation.appendChild(particle);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});