let apiUrl = "";
let apiInterval = null;
let darkMode = true;
let ip = "";

function lockApiUrl() {
  const url = document.getElementById("apiUrl").value.includes("http://")
    ? document.getElementById("apiUrl").value
    : "http://" + document.getElementById("apiUrl").value + "/2/summary";
  if (url) {
    apiUrl = url;
    document.getElementById("lockButton").disabled = true;
    document.getElementById("apiUrl").disabled = true;
    fetchData();
    apiInterval = setInterval(fetchData, 1000);
  }
}

async function getIp() {
  let response = await fetch("https://api.ipify.org/");
  let ipAddress = await response.text();
  ip = ipAddress;
}
getIp();
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    document.getElementById(
      "dataOutput"
    ).innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

function renderData(data) {
  let htmlContent = `<div class="data-section"><h2>General Info</h2>
                <p><strong>Worker ID:</strong> ${data.worker_id}</p>
                <p><strong>Uptime:</strong> ${formatUptime(data.uptime)}</p>
                <p><strong>Huge Pages:</strong> ${
                  data.hugepages.length > 0 ? "Yes" : "No"
                }</p>
                <p><strong>Algorithm:</strong> ${data.algo}</p>
                <p><strong>Version:</strong> ${data.version}</p>
		<p><strong>Paused:</strong> <span style="color: ${
      data.paused ? "Red" : "Green"
    }"> ${data.paused ? "True" : "False"}</span></p>
		<p><strong>Donation:</strong> <span style="color: ${getDonationColor(
      data.donate_level
    )}"> ${data.donate_level}</span></p>
            </div>`;

  htmlContent += `<div class="data-section"><h2>Resources</h2>
                <p><strong>Memory:</strong> Free: ${formatBytes(
                  data.resources.memory.free
                )}, Total: ${formatBytes(data.resources.memory.total)}</p>
                <p><strong>Load Average:</strong> ${data.resources.load_average.join(
                  ", "
                )}</p>
                <p><strong>Hardware Concurrency:</strong> ${
                  data.resources.hardware_concurrency
                }</p>
            </div>`;

  htmlContent += `<div class="data-section"><h2>Connection</h2>
                <p><strong>Pool:</strong> ${data.connection.pool}</p>
		<p><strong>IP:</strong> <span class="ip-address">${ip}</span></p>
                <p><strong>Uptime:</strong> ${formatUptime(
                  data.connection.uptime
                )}</p>
                <p><strong>Ping:</strong> ${data.connection.ping} ms</p>
                <p><strong>Accepted:</strong> ${data.connection.accepted}</p>
                <p><strong>Failures:</strong> ${data.connection.rejected}</p>
                <p><strong>Difficulty:</strong> ${data.connection.diff}</p>
            </div>`;

  htmlContent += `<div class="data-section"><h2>CPU Info</h2>
                <p><strong>Brand:</strong> ${data.cpu.brand}</p>
                <p><strong>Cores:</strong> ${data.cpu.cores}</p>
                <p><strong>Threads:</strong> ${data.cpu.threads}</p>
            </div>`;

  htmlContent += `<div class="data-section"><h2>Hashrate</h2>
                <p><strong>Total Hashrate:</strong> ${data.hashrate.total.join(
                  ", "
                )}</p>
                <p><strong>Highest Hashrate:</strong> ${
                  data.hashrate.highest
                }</p>
            </div>`;

  document.getElementById("dataOutput").innerHTML = htmlContent;
}

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < sizes.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${sizes[i]}`;
}

function getDonationColor(level) {
  level = Math.max(0, Math.min(5, level));

  const green = 255 - level * 50;
  const red = level * 50;
  return `rgb(${red}, ${green}, 0)`;
}
document
  .getElementById("apiUrl")
  .addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      lockApiUrl();
    }
  });

function toggleMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("light-mode", !darkMode);
  document.querySelector(".mode-toggle").textContent = darkMode
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
}
