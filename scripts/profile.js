const email = document.querySelector('.email');
const username = document.querySelector('.username')

const new_name = localStorage.getItem('user');
const currentName = JSON.parse(new_name);
username.textContent = currentName ? currentName : 'Guest';

const themeBtn = document.getElementById("themeToggle");
const html = document.documentElement;

// 1. Load saved theme on page load
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
    themeBtn.textContent = savedTheme === "light" ? "🌙" : "☀️";
} else {
    // Optional: default to light if nothing stored
    html.setAttribute("data-theme", "light");
    themeBtn.textContent = "🌙";
}

// 2. Toggle theme + save in localStorage
themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");

    if (current === "light") {
        html.setAttribute("data-theme", "dark");
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        html.setAttribute("data-theme", "light");
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});
