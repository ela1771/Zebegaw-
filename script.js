let scanHistory = [];
let riskCounts = { LOW:0, MEDIUM:0, HIGH:0 };

const ctx = document.getElementById('riskChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['LOW', 'MEDIUM', 'HIGH'],
        datasets: [{
            label: 'Risk Level Count',
            data: [0,0,0],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336']
        }]
    }
});

async function check() {
    let url = document.getElementById("urlInput").value;
    const output = document.getElementById("output");

    output.textContent = "Scanning...";

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key= <API>",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `
You are a security analyzer. Analyze the following URL and determine if it is phishing.

Return JSON:
{
  "risk_level": "LOW | MEDIUM | HIGH",
  "reason": "explanation",
  "indicators": ["list", "of", "red flags"],
  "safe": true
}

URL: ${url}
`
                    }]
                }]
            })
        }
    );

    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);

    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    let resultJSON = {};

    try { resultJSON = JSON.parse(resultText); } catch (e) {}

    let risk = resultJSON.risk_level || "LOW";

    scanHistory.push({ url, risk });
    riskCounts[risk]++;

    updateHistory();
    updateChart();
}

function updateHistory() {
    let h = document.getElementById("history");
    h.textContent = scanHistory.map(item =>
        `URL: ${item.url}\nRisk: ${item.risk}`
    ).join("\n---------------------------\n");
}

function updateChart() {
    chart.data.datasets[0].data = [
        riskCounts.LOW,
        riskCounts.MEDIUM,
        riskCounts.HIGH
    ];
    chart.update();
}
