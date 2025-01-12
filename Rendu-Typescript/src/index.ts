type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  deadline: Date;
  completed: boolean;
}

const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER") || "null");
if (!currentUser) {
  window.location.href = "login.html";
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault();

  const titleInput = document.querySelector<HTMLInputElement>("#new-task");
  const descInput = document.querySelector<HTMLTextAreaElement>("#task-description");
  const deadlineInput = document.querySelector<HTMLInputElement>("#task-deadline");

  if (!titleInput?.value) {
    alert("Title is required");
    return;
  }

  const newTask: Task = {
    id: generateId(),
    userId: currentUser.id,
    title: titleInput.value,
    description: descInput?.value || "",
    status: "pending",
    deadline: new Date(deadlineInput?.value || Date.now()),
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  addListItem(newTask);
  titleInput.value = "";
  if (descInput) descInput.value = "";
  if (deadlineInput) deadlineInput.value = "";
});

function addListItem(task: Task) {
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
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (!taskJSON) return [];
  const allTasks = JSON.parse(taskJSON);
  return allTasks.filter((task: Task) => task.userId === currentUser.id);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default generateId;
