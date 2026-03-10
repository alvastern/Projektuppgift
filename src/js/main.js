"use strict";
import "../css/main.scss";

// Användaren kan söka på en plats och få upp den på en karta
let mapForm = document.querySelector("main form");
let userInput = document.getElementById("user-input");
let map = document.getElementById("map");
let errorP = document.getElementById("felmeddelande");

let weatherCity = document.querySelector(".väder-stad");
let weatherTemp = document.querySelector(".väder-temp");

function showMap(lat, lon, zoom = 13) {
    const iframeSrc = "https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=" + lat + "%2C" + lon + "&zoom=" + zoom;
    map.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${iframeSrc}"></iframe>`;
}

// Standardkarta när sidan laddas
showMap(59.3293, 18.0686, 10);

mapForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorP.textContent = "";

    try {
        const query = userInput.value.trim();

        if (query === "") {
            throw new Error("Skriv in en plats.");
        }

        const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(query);

        const response = await fetch(url, {
            headers: {
                "Accept-Language": "sv",
            },
        });

        if (!response.ok) {
            throw new Error("Ingen plats hittades, prova igen.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Ingen plats hittades, prova igen.");
        }

        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            throw new Error("Ogiltiga koordinater.");
        }

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Kunde inte hämta väderdata, prova igen.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current || weatherData.current.temperature_2m === undefined) {
            throw new Error("Kunde inte läsa väderdata.");
        }

        const temperature = weatherData.current.temperature_2m;

        weatherCity.textContent = data[0].display_name;
        weatherTemp.textContent = `${temperature}°C`;

        showMap(lat, lon, 13);

    } catch (err) {
        errorP.textContent = err.message;
        console.error(err);
    }
});