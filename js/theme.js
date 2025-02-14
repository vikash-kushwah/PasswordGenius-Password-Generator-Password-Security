const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme") || "light";

// Set initial theme
document.documentElement.setAttribute("data-theme", currentTheme);
toggleSwitch.checked = currentTheme === "dark";

// Theme switch handler
function switchTheme(e) {
    const theme = e.target.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

toggleSwitch.addEventListener("change", switchTheme);