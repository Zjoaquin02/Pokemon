
// ===================== MENU LOGIC =====================
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const toggleDark = document.getElementById("toggle-dark");

menuBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.classList.remove("open");
    }
});

// Dark mode toggle
const toggleDark = document.getElementById("toggle-dark");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

if (toggleDark) {
    toggleDark.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}


// ===================== FILTER (LEGENDARY ONLY) =====================
document.getElementById("apply-filters").addEventListener("click", () => {
    const legendary = document.getElementById("filter-legendary").checked;
    const params = new URLSearchParams();

    if (legendary) params.append("legendary", "1");

    window.location.search = params.toString();
});

document.getElementById("clear-filters").addEventListener("click", () => {
    window.location.search = "";
});
