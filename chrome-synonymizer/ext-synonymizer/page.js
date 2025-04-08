document.addEventListener("DOMContentLoaded", async () => {
    let contentElement = document.getElementById("content");
    contentElement.innerText = "Extracting text...";

    async function injectScript(tabId) {
        return new Promise((resolve) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["script.js"]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Injection failed:", chrome.runtime.lastError.message);
                }
                resolve();
            });
        });
    }

    async function waitForText() {
        return new Promise((resolve) => {
            let retries = 10; // Wait up to 5 seconds
            let interval = setInterval(() => {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    if (!tabs[0]) {
                        console.error("No active tab found.");
                        clearInterval(interval);
                        resolve("No active tab.");
                        return;
                    }

                    let tabId = tabs[0].id;
                    chrome.tabs.sendMessage(tabId, { action: "getText" }, async (response) => {
                        if (chrome.runtime.lastError) {
                            console.warn("Message Error:", chrome.runtime.lastError.message);
                            await injectScript(tabId); // Try injecting the script
                        }

                        let text = response?.trim();
                        if (text && text !== "No real text found.") {
                            clearInterval(interval);
                            resolve(text);
                        }
                    });
                });

                if (--retries === 0) {
                    clearInterval(interval);
                    resolve("No real text found.");
                }
            }, 500);
        });
    }

    let text = await waitForText();
    contentElement.innerText = text || "No real text found.";
});
