function createPopup(x, y, word) {
  // Remove existing popup
  const existing = document.getElementById("synonym-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "synonym-popup";
  popup.innerText = "Looking up…";
  popup.style.position = "fixed";
  popup.style.right = "20px";
  popup.style.bottom = "20px";
  popup.style.backgroundColor = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "8px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = 9999;
  popup.style.maxWidth = "300px";
  popup.style.fontSize = "14px";
  popup.style.fontFamily = "sans-serif";

  document.body.appendChild(popup);

  // Immediately fetch and show definition
  fetchAndShowDefinition(word, popup);

  return popup;
}

function fetchAndShowDefinition(word, popup) {
  popup.innerText = "Fetching synonyms...";

  chrome.runtime.sendMessage({ action: "lookupWord", word }, (response) => {
    console.log("response was ", response);
    popup.innerText = response?.definition || "No synonyms found now.";
  });
}

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection().toString().trim();
  if (selection.length > 0) {
    createPopup(event.pageX + 10, event.pageY + 10, selection);
  }
});
  