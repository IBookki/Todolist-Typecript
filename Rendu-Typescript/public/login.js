"use strict";
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
function loadUsers() {
    const usersJSON = localStorage.getItem("USERS");
    if (!usersJSON)
        return [];
    return JSON.parse(usersJSON);
}
function saveUsers(users) {
    localStorage.setItem("USERS", JSON.stringify(users));
}
registerForm === null || registerForm === void 0 ? void 0 : registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const users = loadUsers();
    if (users.some(user => user.email === email)) {
        alert("Email already exists!");
        return;
    }
    const newUser = {
        id: generateId(),
        email,
        password
    };
    users.push(newUser);
    saveUsers(users);
    alert("Registration successful! Please login.");
});
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem("CURRENT_USER", JSON.stringify(user));
        window.location.href = "index.html";
    }
    else {
        alert("Invalid credentials!");
    }
});
