const API_URL = "https://script.google.com/macros/s/AKfycbynRxJFwlXtx6a9ofJRNRg-v9zBsyY1EK9bn7Q6QLNLVupMxk-wF5Dli7Purrsf3Nwk/exec";

document.getElementById("searchBtn").addEventListener("click", async () => {
  const driverId = document.getElementById("driverId").value.trim();
  const date = document.getElementById("dateSelect").value;

  if (!driverId || !date) {
    alert("Por favor introduce tu número de conductor y selecciona una fecha");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Buscando...";

  try {
    const response = await fetch(`${API_URL}?driver_id=${driverId}&fecha=${date}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
      return;
    }

    // Mostrar nombre del conductor
    document.getElementById("driverName").innerText = `Conductor: ${data.nombre}`;

    // Construir HTML de resultados
    let html = "";

    if (data.servicios && data.servicios.length) {
      data.servicios.forEach(s => {
        html += `
          <div class="servicio">
            <h3>Servicio del ${s.fecha}</h3>
            <pre>${s.servicio || "No disponible"}</pre>
            ${s.desglose_url ? `<a href="${s.desglose_url}" target="_blank">📄 Descargar Desglose</a><br>` : ""}
            ${s.cuadrante_url ? `<a href="${s.cuadrante_url}" target="_blank">📄 Descargar Cuadrante</a>` : ""}
          </div>
        `;
      });
    } else {
      html = "<p>No hay servicios para esa fecha.</p>";
    }

    resultDiv.innerHTML = html;

  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Error de conexión</p>`;
  }
});



