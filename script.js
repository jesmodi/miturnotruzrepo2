// ✅ URL del WebApp desplegado (Apps Script)
const API_URL = "https://script.google.com/macros/s/AKfycbyXqA5vPRseOUoAEd6j5O_Qt1LzOCzC0YNbR0F3XiodDAQaxwfFpvIPQgDLpc3cIOTN/exec";

// Esperar a que cargue el DOM antes de añadir listeners
document.addEventListener("DOMContentLoaded", () => {

  const driverInput = document.getElementById("driverId");
  const dateInput = document.getElementById("dateSelect");
  const resultDiv = document.getElementById("result");
  const searchBtn = document.getElementById("searchBtn");
  const testGoogleBtn = document.getElementById("testGoogleBtn");
  const privacyLink = document.getElementById("privacyLink");

  // --- BOTÓN PRINCIPAL DE CONSULTA ---
  searchBtn.addEventListener("click", async () => {
    const driverId = driverInput.value.trim();
    const date = dateInput.value;

    if (!driverId || !date) {
      alert("⚠️ Por favor, introduce tu número de conductor y selecciona una fecha.");
      return;
    }

    resultDiv.innerHTML = "<p>🔎 Buscando turno...</p>";

    try {
      // ✅ Petición GET con parámetros
      const url = `${API_URL}?action=turno&numero=${encodeURIComponent(driverId)}&fecha=${encodeURIComponent(date)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
        mode: "cors"
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("📩 Respuesta del servidor:", data);

      if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
        return;
      }

      // Mostrar resultados
      let html = `
        <h3>🧑‍✈️ Conductor: ${data.conductor || driverId}</h3>
        <p><b>Fecha:</b> ${data.fecha || date}</p>
        <p><b>Tipo de día:</b> ${data.tipoDia || "No especificado"}</p>
        <p><b>Servicio:</b> ${data.servicio || "Sin datos"}</p>
      `;

      // Imagen generada (si existe)
      if (data.imageUrl) {
        html += `
          <div style="margin-top:15px;">
            <img src="${data.imageUrl}" alt="Turno generado"
                 style="max-width:90%;border:1px solid #ccc;border-radius:10px;
                 box-shadow:0 0 6px rgba(0,0,0,0.1);">
          </div>
        `;
      }

      resultDiv.innerHTML = html;

    } catch (err) {
      console.error("Error:", err);
      resultDiv.innerHTML = `<p style="color:red;">❌ Error de conexión con el servidor.<br>${err.message}</p>`;
    }
  });

  // --- BOTÓN DE AUTORIZACIÓN GOOGLE (OAuth2) ---
  testGoogleBtn.addEventListener("click", () => {
    const oauthUrl = `${API_URL}?action=auth`;
    window.open(oauthUrl, "_blank", "width=600,height=700");
  });

  // --- ENLACE DE POLÍTICA DE PRIVACIDAD ---
  privacyLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("privacy.html", "_blank");
  });

});
