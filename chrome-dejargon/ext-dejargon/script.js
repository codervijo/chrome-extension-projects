function createPopup(text, x, y, word) {
    // Remove existing popup
    const existing = document.getElementById("dejargon-popup");
    if (existing) existing.remove();
  
    const popup = document.createElement("div");
    popup.id = "dejargon-popup";
    popup.innerText = "Looking up…";
    popup.style.position = "absolute";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.backgroundColor = "#fff";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "8px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    popup.style.zIndex = 9999;
    popup.style.maxWidth = "300px";
    popup.style.fontSize = "14px";
    popup.style.fontFamily = "sans-serif";
  
    const close = document.createElement("span");
    close.innerText = "✖";
    close.style.float = "right";
    close.style.cursor = "pointer";
    close.style.marginLeft = "10px";
    close.onclick = () => popup.remove();
    popup.appendChild(close);
  
    // Create selection buttons for Dictionary and Urban Dictionary
    const dictionaryBtn = document.createElement("button");
    dictionaryBtn.innerText = "📖 Dictionary";
    dictionaryBtn.style.marginRight = "5px";
    dictionaryBtn.onclick = () => fetchAndShowDefinition(word, "dictionary", popup);
  
    const urbanBtn = document.createElement("button");
    urbanBtn.innerText = "🌍 Urban";
    urbanBtn.onclick = () => fetchAndShowDefinition(word, "urban", popup);
  
    popup.appendChild(document.createElement("br"));
    popup.appendChild(dictionaryBtn);
    popup.appendChild(urbanBtn);
  
    document.body.appendChild(popup);
    return popup;
  }
  
  function fetchAndShowDefinition(word, source, popup) {
    popup.innerText = "Fetching definition...";
    
    chrome.runtime.sendMessage({ action: "lookupWord", word, source }, (response) => {
      popup.innerText = response?.definition || "No definition found.";
    });
  }
  
  document.addEventListener("mouseup", (event) => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
      createPopup("Select source...", event.pageX + 10, event.pageY + 10, selection);
    }
  });
  
  