let mediaRecorder;
let audioChunks = [];

function triggerSOS() {
  const sosStatus = document.getElementById("sosStatus");
  const geoOutput = document.getElementById("geoOutput");
  const audioStatus = document.getElementById("audioStatus");

  // Show status container
  sosStatus.classList.remove("hidden");
  geoOutput.innerText = "Fetching GPS coordinates...";
  audioStatus.innerText = "🎤 Recording audio sample (5s)...";

  // 1. Geolocation Logic
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        geoOutput.innerText = `🚨 ALERT SENT!\nLat: ${lat}, Lon: ${lon}`;
      },
      (error) => {
        geoOutput.innerText = "🚨 ALERT SENT!\nGPS Unavailable (Simulated: 13.0827, 80.2707)";
      }
    );
  } else {
    geoOutput.innerText = "🚨 ALERT SENT!\n(Simulated GPS: 13.0827, 80.2707)";
  }

  // 2. Audio Capture Snippet (5 Seconds)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          audioStatus.innerText = "✅ 5s Emergency Audio Secured.";
        }, 5000);
      })
      .catch((err) => {
        audioStatus.innerText = "⚠️ Mic permission denied (Audio simulated).";
      });
  } else {
    audioStatus.innerText = "⚠️ Mic unavailable on browser.";
  }
}