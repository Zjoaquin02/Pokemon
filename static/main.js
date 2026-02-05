// ----------------------------
// Modo oscuro
// ----------------------------

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ----------------------------
// Modal con imagen Pokémon
// ----------------------------
document.addEventListener("click", async (e) => {
    const box = e.target.closest(".evo-click");
    if (!box) return;

    const name = box.dataset.name.toLowerCase();

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();

    document.getElementById("modal-img").src =
        data.sprites.other["official-artwork"].front_default;

    document.getElementById("modal-name").textContent =
        name.charAt(0).toUpperCase() + name.slice(1);

    document.getElementById("modal-bg").style.display = "flex";
});

// ----------------------------
// Cerrar modal
// ----------------------------
document.getElementById("modal-bg").addEventListener("click", (e) => {
    if (e.target.id === "modal-bg") {
        e.currentTarget.style.display = "none";
    }
});
