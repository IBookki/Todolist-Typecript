type User = {
    id: string;
    email: string;
    password: string;
}

const loginForm = document.querySelector<HTMLFormElement>("#login-form");
const registerForm = document.querySelector<HTMLFormElement>("#register-form");

function loadUsers(): User[] {
    const usersJSON = localStorage.getItem("USERS");
    if (!usersJSON) return [];
    return JSON.parse(usersJSON);
}

function saveUsers(users: User[]) {
    localStorage.setItem("USERS", JSON.stringify(users));
}

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (document.getElementById("register-email") as HTMLInputElement).value;
    const password = (document.getElementById("register-password") as HTMLInputElement).value;
    
    const users = loadUsers();
    if (users.some(user => user.email === email)) {
        alert("Email already exists!");
        return;
    }

    const newUser: User = {
        id: generateId(),
        email,
        password
    };

    users.push(newUser);
    saveUsers(users);
    alert("Registration successful! Please login.");
});

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (document.getElementById("login-email") as HTMLInputElement).value;
    const password = (document.getElementById("login-password") as HTMLInputElement).value;
    
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("CURRENT_USER", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials!");
    }
});
