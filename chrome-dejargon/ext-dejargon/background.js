async function fetchDefinition(word, source) {
    try {
      let url = "";
  
      if (source === "dictionary") {
        url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      } else if (source === "urban") {
        url = `https://api.urbandictionary.com/v0/define?term=${word}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (source === "dictionary" && Array.isArray(data) && data.length > 0) {
        return data[0].meanings[0].definitions[0].definition || "No definition found.";
      }
  
      if (source === "urban" && data.list.length > 0) {
        return data.list[0].definition.replace(/\[|\]/g, ""); // Remove [] formatting
      }
  
      return "No definition found.";
    } catch (error) {
      return "Error fetching definition.";
    }
  }
  
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "lookupWord") {
      const definition = await fetchDefinition(request.word, request.source || "dictionary");
      sendResponse({ definition });
    }
    return true; // Required for async response
  });
  