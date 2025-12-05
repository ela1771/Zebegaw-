import requests
import json

API_KEY = "<Your Api Key>"

def scan_email(email_text):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Analyze the following email for phishing signs. "
                                f"Give risk level (0-100), summary, and what to look out for:\n\n{email_text}"
                    }
                ]
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        print("Error:", response.text)
        return None

    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except:
        return data



if __name__ == "__main__":
    test_email = """
    Your Gmail account will be deleted in 24 hours unless you verify your identity.
    Click this link to cancel deletion:
    http://gmail-security-verification-alert.net
    """

    print(scan_email(test_email))
