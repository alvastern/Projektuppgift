"use strict";
import "../css/main.scss";

// Funktion där användaren kan söka på en plats och få upp den på en karta
let mapForm = document.querySelector("main form");
let searchButton = document.getElementById("knapp-sök");
let userInput = document.getElementById("user-input");
let map = document.getElementById("map");
let errorP = document.getElementById("felmeddelande");

mapForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorP.textContent = "";

    try {
        const query = userInput.value.trim();
        const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(query);

        const response = await fetch(url, {
        headers: {
            "Accept-Language": "sv",
        }
    });

    if(!response.ok) {
        throw new Error("Ingen plats hittades, prova igen.")
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Ingen plats hittades, prova igen.")
    }

    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);

    if(!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error("Prova igen");
    }

    const zoomMap = 13;
    const iframeSrc = "https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=" + lat + "%2C" + lon + "&zoom=" + zoomMap;
    map.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${iframeSrc}"></iframe>`;

} catch (err) {
        errorP.textContent = err.message;
        console.error(err);
    };
});