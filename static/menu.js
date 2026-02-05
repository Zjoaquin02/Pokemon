document.addEventListener("DOMContentLoaded", () => {

    /* ===================== MENÚ ===================== */

    const menuBtn = document.getElementById("menu-btn");
    const sideMenu = document.getElementById("side-menu");
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

    /* ===================== FILTROS ===================== */

    const applyBtn = document.getElementById("apply-filters");
    const clearBtn = document.getElementById("clear-filters");
    const legendaryCheckbox = document.getElementById("filter-legendary");

    // Al cargar, reflejar estado desde la URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("legendary") === "1") {
        legendaryCheckbox.checked = true;
    }

    // Aplicar filtros
    applyBtn.addEventListener("click", () => {
        const newParams = new URLSearchParams(window.location.search);

        if (legendaryCheckbox.checked) {
            newParams.set("legendary", "1");
        } else {
            newParams.delete("legendary");
        }

        window.location.search = newParams.toString();
    });

    // Limpiar filtros
    clearBtn.addEventListener("click", () => {
        const currentParams = new URLSearchParams(window.location.search);
        const nextParams = new URLSearchParams();

        // Mantener "started" si existe
        if (currentParams.has("started")) {
            nextParams.set("started", "1");
        }

        window.location.search = nextParams.toString();
    });

    /* ===================== DARK MODE ===================== */

    // 1️⃣ Aplicar tema guardado al cargar
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        toggleDark.textContent = "☀️ ALBA";
    } else {
        toggleDark.textContent = "🌙 OCASO";
    }

    // 2️⃣ Toggle + guardar preferencia
    toggleDark.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");

        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleDark.textContent = isDark ? "☀️ ALBA" : "🌙 OCASO";
    });

});
