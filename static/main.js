document.addEventListener("DOMContentLoaded", () => {

    console.log("main.js activo");

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

    document.getElementById("modal-bg").addEventListener("click", e => {
        if (e.target.id === "modal-bg") {
            e.currentTarget.style.display = "none";
        }
    });

});
