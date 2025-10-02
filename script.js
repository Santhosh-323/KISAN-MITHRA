document.getElementById("gpsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const coord1 = document.getElementById("coord1").value.split(",");
  const coord2 = document.getElementById("coord2").value.split(",");
  const coord3 = document.getElementById("coord3").value.split(",");
  const coord4 = document.getElementById("coord4").value.split(",");

  const coords = [
    { lat: parseFloat(coord1[0]), lng: parseFloat(coord1[1]) },
    { lat: parseFloat(coord2[0]), lng: parseFloat(coord2[1]) },
    { lat: parseFloat(coord3[0]), lng: parseFloat(coord3[1]) },
    { lat: parseFloat(coord4[0]), lng: parseFloat(coord4[1]) }
  ];

  fetch("http://127.0.0.1:5000/process-gps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coordinates: coords })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("inputView").style.display = "none";
      document.getElementById("dashboardView").style.display = "block";

      const fieldStats = document.getElementById("fieldStats");
      fieldStats.innerHTML = "";

      const statsData = [
        { title: "📏 Width", value: `${data.width} cm` },
        { title: "📐 Length", value: `${data.length} cm` },
        { title: "🧱 Columns", value: data.columns },
        { title: "🪴 Rows", value: data.rows },
        { title: "🌱 Seedlings", value: data.seedlings }
      ];

      statsData.forEach(stat => {
        const box = document.createElement("div");
        box.className = "stat-box";
        box.innerHTML = `
          <div class="stat-title">${stat.title}</div>
          <div class="stat-value">${stat.value}</div>
        `;
        fieldStats.appendChild(box);
      });

      // Battery simulation
      let battery = 100;
      const batteryLevel = document.getElementById("batteryLevel");
      const batteryText = document.getElementById("batteryText");

      const drainBattery = setInterval(() => {
        battery -= 5;
        if (battery < 0) battery = 0;

        batteryLevel.style.width = battery + "%";
        batteryText.textContent = "Battery: " + battery + "%";

        if (battery <= 20) {
          batteryLevel.style.background = "#f44336";
          batteryText.textContent += " ⚠️ Low Battery!";
          clearInterval(drainBattery);
        }
      }, 1000);

      // Planting progress
      let progress = 0;
      const progressBar = document.getElementById("progressBar");
      const progressText = document.getElementById("progressText");

      const fillProgress = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + "%";

        if (progress === 100) {
          progressText.textContent = "Planting Completed ✅";
          clearInterval(fillProgress);
        }
      }, 500);

      // AI Insights
      const aiInsights = document.getElementById("aiInsights");
      setTimeout(() => {
        aiInsights.innerHTML = `
          <p>✅ Field dimensions optimized for planting</p>
          <p>✅ Battery sufficient for full coverage</p>
          <p>💡 Suggest reducing row density for better yield</p>
        `;
      }, 3000);

      // Field Map Drawing
      const canvas = document.getElementById("fieldCanvas");
      const ctx = canvas.getContext("2d");

      function scaleCoord(lat, lng) {
        const scale = 10;
        return {
          x: (lng - coords[0].lng) * scale + 50,
          y: (lat - coords[0].lat) * -scale + 250
        };
      }

      const points = coords.map(c => scaleCoord(c.lat, c.lng));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = "#4caf50";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(76, 175, 80, 0.2)";
      ctx.fill();

      const labels = ["TL", "TR", "BR", "BL"];
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#388e3c";
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "12px Segoe UI";
        ctx.fillText(labels[i], p.x + 6, p.y - 6);
      });
    })
    .catch(err => {
      alert("❌ Failed to connect to backend:\n" + err.message);
    });
});

function goBack() {
  document.getElementById("dashboardView").style.display = "none";
  document.getElementById("inputView").style.display = "block";
}

function toggleMap() {
  const mapContainer = document.getElementById("mapContainer");
  mapContainer.style.display = mapContainer.style.display === "none" ? "block" : "none";
}