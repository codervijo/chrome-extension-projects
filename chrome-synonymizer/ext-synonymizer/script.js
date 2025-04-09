function createPopup(initialText, x, y, word) {
  const existing = document.getElementById("dejargon-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "dejargon-popup";
  popup.style.position = "fixed";
  popup.style.left = "20px";
  popup.style.top = "20px";
  popup.style.backgroundColor = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "8px 12px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = 9999;
  popup.style.maxWidth = "300px";
  popup.style.fontSize = "14px";
  popup.style.fontFamily = "sans-serif";
  popup.style.lineHeight = "1.5";

  // ✖ Close Button
  const close = document.createElement("span");
  close.innerText = "✖";
  close.style.float = "right";
  close.style.cursor = "pointer";
  close.style.marginLeft = "10px";
  close.style.fontWeight = "bold";
  close.style.color = "#888";
  close.onclick = () => popup.remove();

  // Content area (will update later)
  const content = document.createElement("div");
  content.innerText = initialText;

  popup.appendChild(close);
  popup.appendChild(content);
  document.body.appendChild(popup);

  // Fetch and update content
  fetchAndShowDefinition(word, content);
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
    createPopup("Fetching synonym...", event.pageX + 10, event.pageY + 10, selection);
  }
});
  