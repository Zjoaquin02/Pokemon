document.addEventListener("DOMContentLoaded", () => {

    /* ===================== MENÚ ===================== */

    const menuBtn   = document.getElementById("menu-btn");
    const sideMenu  = document.getElementById("side-menu");
    const toggleDark = document.getElementById("toggle-dark");

    if (!menuBtn || !sideMenu) return;

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sideMenu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        sideMenu.classList.remove("open");
    });

    sideMenu.addEventListener("click", e => e.stopPropagation());

    /* ===================== DARK MODE ===================== */

    // 1️⃣ Aplicar tema guardado al cargar
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        toggleDark.textContent = "☀️ Modo claro";
    } else {
        toggleDark.textContent = "🌙 Modo oscuro";
    }

    // 2️⃣ Toggle + guardar preferencia
    toggleDark.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");

        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleDark.textContent = isDark ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });

});
