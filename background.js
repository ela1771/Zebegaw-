chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        checkURL(tab.url);
    }
});

async function checkURL(url) {
    try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=<API key> ",
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
        });

        const data = await response.json();
        console.log("Phishing Report:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}
