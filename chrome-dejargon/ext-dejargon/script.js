function extractShadowDOMText(root) {
    let text = root.innerText || "";
    root.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) {
            text += "\n" + extractShadowDOMText(el.shadowRoot);
        }
    });
    return text;
}

async function getPageText() {
    return new Promise((resolve) => {
        let retries = 10;
        let interval = setInterval(() => {
            let bodyText = document.body.innerText.trim();
            let shadowText = extractShadowDOMText(document.body).trim();
            let allText = [bodyText, shadowText];

            // Extract text from headings and paragraphs only
            document.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
                allText.push(el.innerText);
            });

            document.querySelectorAll("iframe").forEach((iframe) => {
                try {
                    let doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (doc) {
                        allText.push(doc.body.innerText);
                    }
                } catch (error) {
                    console.warn("Blocked from accessing iframe due to CORS");
                }
            });

            let fullText = allText.join("\n\n").trim();
            if (fullText.length > 100 || retries <= 0) {
                clearInterval(interval);
                resolve(fullText || "No real text found.");
            }
            retries--;
        }, 500);
    });
}

// Listens for a request from the extension to extract text
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getText") {
        getPageText().then(sendResponse);
        return true; // Indicates async response
    }
});

