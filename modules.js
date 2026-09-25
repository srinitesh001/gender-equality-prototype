// Initialize Safety Map and Anonymous Reporting Module
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Interactive Leaflet Map
  // Default coordinates set to central point (e.g., Chennai area: 13.0827, 80.2707)
  const mapContainer = document.getElementById('map');
  
  if (mapContainer) {
    const map = L.map('map').setView([13.0827, 80.2707], 13);

    // OpenStreetMap Free Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Simulated Safety Zones & Danger Markers
    const safeZone = L.circle([13.0827, 80.2707], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.3,
      radius: 800
    }).addTo(map);
    safeZone.bindPopup("<b>Safe Zone:</b> High Police Patrol & Active Lighting");

    const dangerZone = L.circle([13.0950, 80.2800], {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.3,
      radius: 600
    }).addTo(map);
    dangerZone.bindPopup("<b>Caution Zone:</b> Poor Lighting & Unsafe Incident Reports");
  }

  // 2. Initial Data for Community Incident Feed
  const initialReports = [
    { loc: "Main Street Alley", type: "Poor Lighting", desc: "Streetlights broken near the transit bus stop." },
    { loc: "Tech Park Block B", type: "Pay / Role Inequality", desc: "Escalated wage transparency concern." },
    { loc: "Central Metro Exit 2", type: "Verbal Abuse / Stalking", desc: "Frequent harassment reported after 8 PM." }
  ];

  const reportList = document.getElementById("reportList");

  // Render Reports to UI
  function renderReports() {
    if (!reportList) return;
    reportList.innerHTML = "";
    initialReports.forEach(r => {
      const li = document.createElement("li");
      li.className = "bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-sm";
      li.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-emerald-400 text-xs">[${r.type}]</span>
          <span class="text-slate-400 text-[10px] font-mono">${r.loc}</span>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${r.desc}</p>
      `;
      reportList.appendChild(li);
    });
  }

  renderReports();

  // 3. Handle Form Submission for New Anonymous Incidents
  const form = document.getElementById("incidentForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const loc = document.getElementById("incLocation").value.trim();
      const type = document.getElementById("incType").value;
      const desc = document.getElementById("incDesc").value.trim();

      if (loc && desc) {
        // Add new incident to top of feed
        initialReports.unshift({ loc, type, desc });
        renderReports();

        // Reset form inputs
        form.reset();
      }
    });
  }
});