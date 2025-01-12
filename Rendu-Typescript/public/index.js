const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER") || "null");
if (!currentUser) {
    window.location.href = "login.html";
}
const list = document.querySelector("#list");
const form = document.getElementById("new-task-form");
const input = document.querySelector("#new-task");
const tasks = loadTasks();
tasks.forEach(addListItem);
form === null || form === void 0 ? void 0 : form.addEventListener("submit", e => {
    e.preventDefault();
    const titleInput = document.querySelector("#new-task");
    const descInput = document.querySelector("#task-description");
    const deadlineInput = document.querySelector("#task-deadline");
    if (!(titleInput === null || titleInput === void 0 ? void 0 : titleInput.value)) {
        alert("Title is required");
        return;
    }
    const newTask = {
        id: generateId(),
        userId: currentUser.id,
        title: titleInput.value,
        description: (descInput === null || descInput === void 0 ? void 0 : descInput.value) || "",
        status: "pending",
        deadline: new Date((deadlineInput === null || deadlineInput === void 0 ? void 0 : deadlineInput.value) || Date.now()),
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    addListItem(newTask);
    titleInput.value = "";
    if (descInput)
        descInput.value = "";
    if (deadlineInput)
        deadlineInput.value = "";
});
function addListItem(task) {
    const item = document.createElement("li");
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    const taskContent = document.createElement("div");
    taskContent.className = "task-content";
    const header = document.createElement("div");
    header.className = "task-header";
    const title = document.createElement("h3");
    title.textContent = task.title;
    const description = document.createElement("p");
    description.textContent = task.description;
    const deadline = document.createElement("span");
    deadline.textContent = `Due to: ${new Date(task.deadline).toLocaleDateString()}`;
    deadline.className = "task-deadline";
    const actions = document.createElement("div");
    actions.className = "task-actions";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.disabled = task.completed;
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        task.status = checkbox.checked ? 'completed' : 'pending';
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        saveTasks();
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.disabled = task.completed;
    deleteBtn.addEventListener("click", () => {
        if (!task.completed && confirm("Are you sure you want to delete this task?")) {
            const index = tasks.findIndex(t => t.id === task.id);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasks();
                item.remove();
            }
        }
    });
    header.append(title, deadline);
    taskContent.append(header, description);
    actions.append(checkbox, deleteBtn);
    item.append(taskContent, actions);
    list === null || list === void 0 ? void 0 : list.append(item);
}
function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}
function loadTasks() {
    const taskJSON = localStorage.getItem("TASKS");
    if (!taskJSON)
        return [];
    const allTasks = JSON.parse(taskJSON);
    return allTasks.filter((task) => task.userId === currentUser.id);
}
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export default generateId;
